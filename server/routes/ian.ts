'use strict';

import config from 'config';
import axios from 'axios';
import DicomNameToTag from '../constants/dicomNameToTag.json';
import DicomTagToName from '../constants/dicomTagToName.json';

// import DicomTagsToImport from '../constants/dicomTagsToImport';
import { cFacility } from '../models/facility';
import { cReferringPhysician } from '../models/referringPhysician';
import { parseDicomDate } from '../utils/dateUtils';

import { Router } from 'express';
import { cStudy } from '../models/study';
const router = Router();
import { getToken } from '../utils/dcm4cheeAuth';

import {
  GQLStudyLateralityEnum,
  GQLContrastPresentEnum,
  GQLStudyStatusEnum,
  GQLStudySupportRequestStatusEnum,
} from '../graphql/types';
import { access } from 'fs';

function getDicomTags(metadata) {
  const dcmTags = metadata[0];
  const importedDicomTags = {};
  const dcmTagKeys = Object.keys(dcmTags);
  for (let i = 0; i < dcmTagKeys.length; ++i) {
    const tagToImport = dcmTagKeys[i];
    if (!DicomTagToName[tagToImport]) {
      continue;
    }

    const dcmTag = dcmTags[tagToImport];
    const value = dcmTag && dcmTag.Value && dcmTag.Value[0];
    if (value) {
      let convertedValue = null;

      switch (dcmTag.vr) {
        case 'PN':
          convertedValue = value.Alphabetic;
          break;
        case 'DA':
          convertedValue = parseDicomDate(value);
          break;
        default:
          convertedValue = value;
      }

      importedDicomTags[DicomTagToName[tagToImport]] = convertedValue;
    }
  }

  return importedDicomTags;
}

// function getDicomTags__onlySelected(metadata) {
//   const dcmTags = metadata[0];
//   const importedDicomTags = {};
//   for (let i = 0; i < DicomTagsToImport.length; ++i) {
//     const tagToImport = DicomNameToTag[DicomTagsToImport[i]];

//     const dcmTag = dcmTags[tagToImport];
//     const value = dcmTag && dcmTag.Value && dcmTag.Value[0];
//     if (value) {
//       let convertedValue = null;
//       switch (dcmTag.vr) {
//         case 'PN':
//           convertedValue = value.Alphabetic;
//           break;
//         case 'DT':
//         case 'DA':
//           parseDicomDate(value);
//         default:
//       }
//       importedDicomTags[DicomTagsToImport[i]] = dcmTag.vr === 'PN' ? value.Alphabetic : value;
//     }
//   }

//   return importedDicomTags;
// }

router.put('/ian', async (req, res) => {
  const studyInstanceUid = req.body.studyiuid;
  const study = await cStudy().findOne({ 'dicomTags.StudyInstanceUID': studyInstanceUid });
  if (!study) {
    const clientSecret = config.get<string>('dcm4chee.authClientSecret');

    let accessToken = null;
    if (clientSecret && clientSecret.length) {
      accessToken = await getToken(clientSecret);
    }

    var axiosConfig = { headers: {} };

    console.log(accessToken);
    if (accessToken) {
      axiosConfig.headers['Authorization'] = `bearer ${accessToken}`;
    }

    const listSeriesUrl = `${config.get('dcm4chee.restUrl')}/dcm4chee-arc/aets/${config.get(
      'dcm4chee.AETitle',
    )}/rs/studies/${studyInstanceUid}/series`;

    const series = (await axios.get(listSeriesUrl, axiosConfig)).data;

    // might need to filter out series which might not have good metadata, like modality OT,...
    const seriesUrl = `${series[0]['00081190'].Value[0]}/instances/?limit=1`;

    const sopInstances = (await axios.get(seriesUrl, axiosConfig)).data;

    const metadataUrl = `${sopInstances[0]['00081190'].Value[0]}/metadata`;

    const metadata = (await axios.get(metadataUrl, axiosConfig)).data;
    const dicomTags: any = getDicomTags(metadata);
    let facility = null;
    // assign to facility based on ScheduledStudyLocationAETitle tag
    if (dicomTags.ScheduledStudyLocationAETitle && dicomTags.ScheduledStudyLocationAETitle.length) {
      facility = await cFacility().findOne({
        'dicomDetails.AETitle': dicomTags.ScheduledStudyLocationAETitle,
      });
    }

    if (!facility) {
      facility = await cFacility().findOne({ 'dicomDetails.AETitle': '___UNKNOWN___' });
    }

    const referringPhysicianIds = [];

    if (dicomTags.ReferringPhysicianName && dicomTags.ReferringPhysicianName.length) {
      const referringPhysician = await cReferringPhysician().findOne({
        facilityId: facility._id,
        dicomValue: dicomTags.ReferringPhysicianName,
      });
      if (referringPhysician) {
        referringPhysicianIds.push(referringPhysician._id);
      }
    }

    await cStudy().findOneAndUpdate(
      { 'dicomTags.StudyInstanceUID': dicomTags.StudyInstanceUID },
      {
        arriveTimeStart: new Date(),
        facilityId: facility._id,
        referringPhysicianIds,
        dicomTags,
        patientName: dicomTags.PatientName,
        patientId: dicomTags.PatientID,
        patientDOB: dicomTags.PatientBirthDate,
        patientSex: dicomTags.PatientSex,
        history: '',
        studyStatus: GQLStudyStatusEnum.NEW,
        supportRequestStatus: GQLStudySupportRequestStatusEnum.NONE,
        contrastPresent: GQLContrastPresentEnum.NOT_SELECTED,
        laterality: GQLStudyLateralityEnum.NOT_SELECTED,
        notes: [],
        addendums: [],
        _sModality: dicomTags.Modality,
        _sStudyDescription: dicomTags.StudyDescription,
        _sAssignedRadiologistName: '',
        _sFacilityName: facility.institutionName,
      },
      { upsert: true, returnOriginal: false },
    );
  }

  res.type('json').send({ status: 'true' });
});

export default router;
