import axios from 'axios';
import moment from 'moment';

// doc: https://fms.directradiology.com/fmi/rest/apidoc/

const baseUrl = 'https://fms.directradiology.com/fmi/rest/api';
const tokenUrl = `${baseUrl}/auth/DR_Management`;
const privilegesUrl = `${baseUrl}/find/DR_Management/PrivsInFacilities_JSON`;
const radiologistsUrl = `${baseUrl}/find/DR_Management/RadPrivs_JSON`;
const facilitiesUrl = `${baseUrl}/find/DR_Management/Facilities_JSON`;

import { cUser, getUserDefaults } from '../models/user';
import { cUserRole } from '../models/userRole';
import { cFacility, getFacilityDefaults } from '../models/facility';

import { connectDb, disconnectDb } from '../mongodb';

const FM_DATE_FORMAT = 'MM/DD/YYYY';
async function getToken(layout) {
  const response = await axios.post(tokenUrl, {
    user: process.env.FM_USER,
    password: process.env.FM_PASSWORD,
    layout,
  });

  return response.data.token;
}

/*async function getPrivileges(token) {
  const response = await axios.post(
    privilegesUrl,
    {
      query: [{ zModificationTimestamp: '>05/01/2000' }],
      range: '100000',
    },
    {
      headers: { 'FM-Data-token': token },
    },
  );
  return response.data.data;
}*/

async function getFeed(token, url) {
  const response = await axios.post(
    url,
    {
      query: [{ zCreationTimestamp: '>05/01/1950' }],
      range: '100000',
    },
    {
      headers: { 'FM-Data-token': token },
    },
  );
  return response.data.data;
}

async function updateRadiologists(radiologists) {
  const radUserRole = await cUserRole().findOne({ builtInName: 'RADIOLOGIST' });

  const bulkWrite = radiologists.map(rad => {
    const fields = rad.fieldData;
    return {
      updateOne: {
        filter: {
          fmId: fields._k_RadiologistsID,
        },
        update: {
          $set: {
            fmId: fields._k_RadiologistsID,
            email: fields.Email1,
            firstName: fields.RadiologistName_First,
            lastName: fields.RadiologistName_Last,
            radiologyCapacity: Number(fields.Capacity),
            userRoleId: radUserRole._id,
          },
          $setOnInsert: getUserDefaults(),
        },
        upsert: true,
      },
    };
  });

  return cUser().bulkWrite(bulkWrite);
}

async function syncRadiologists() {
  const token = await getToken('RadPrivs_JSON');
  const radiologists = await getFeed(token, radiologistsUrl);
  await updateRadiologists(radiologists);
}

async function updateFacilities(facilities) {
  const bulkWrite = facilities.map(facility => {
    const fields = facility.fieldData;

    return {
      updateOne: {
        filter: {
          fmId: fields._k_FacilityID,
        },
        update: {
          $set: {
            fmId: fields._k_FacilityID,
            institutionName: fields.HOSPITAL,
            email: fields.Email,
            faxNumber: fields.FAX,
            phoneNumber: fields.PHONE,
            address: fields.ADDRESS,
            city: fields.CITY,
            state: fields.ST,
            zip: fields.ZIP,
          },
          $setOnInsert: getFacilityDefaults(),
        },
        upsert: true,
      },
    };
  });

  return cFacility().bulkWrite(bulkWrite);
}

async function syncFacilities() {
  const token = await getToken('Facilities_JSON');
  const facilities = await getFeed(token, facilitiesUrl);
  await updateFacilities(facilities);
}

async function updateFacilityRadiologistAssignment(privileges) {
  const assignments = {};

  const radUserRole = await cUserRole().findOne({ builtInName: 'RADIOLOGIST' });

  const radFmIdToObjectIdMapping = {};
  const radiologists = await cUser()
    .find({ userRoleId: radUserRole._id })
    .toArray();
  radiologists.forEach(rad => {
    radFmIdToObjectIdMapping[rad.fmId] = rad._id;
  });

  privileges.forEach(priv => {
    const fields = priv.fieldData;
    const facilityFmId = fields._kf_FacilityID;
    const radiologistFmId = fields._kf_RadiologistID;
    if (!assignments[facilityFmId]) {
      assignments[facilityFmId] = [];
    }
    const startDate = moment(fields.APPT, FM_DATE_FORMAT);
    const endDate = moment(fields.EXP, FM_DATE_FORMAT).endOf('day');
    // not all startDates are filled in
    if (
      fields.SchedularStatus === 'Active' &&
      moment().isBefore(endDate) &&
      (startDate.isValid() ? moment().isAfter(startDate) : true)
    ) {
      assignments[facilityFmId].push(radFmIdToObjectIdMapping[radiologistFmId]);
    }
  });

  const allFacilityFmIds = Object.keys(assignments);

  const bulkWrite: Array<any> = allFacilityFmIds.map(facilityFmId => {
    return {
      updateOne: {
        filter: {
          fmId: facilityFmId,
        },
        update: {
          $set: { assignedRadiologistIds: assignments[facilityFmId] },
        },
      },
    };
  });

  // remove the assignments from facilities that are not in FM anymore:
  bulkWrite.push({
    updateMany: {
      filter: {
        fmId: { $nin: allFacilityFmIds },
      },
      update: {
        $set: { assignedRadiologistIds: [] },
      },
    },
  });

  return cFacility().bulkWrite(bulkWrite);
}

async function syncFacilityRadiologistAssignment() {
  const token = await getToken('PrivsInFacilities_JSON');
  const privileges = await getFeed(token, privilegesUrl);
  return updateFacilityRadiologistAssignment(privileges);
}

async function syncFM() {
  await connectDb();

  await syncRadiologists();
  await syncFacilities();
  await syncFacilityRadiologistAssignment();

  await disconnectDb();
}

syncFM();
