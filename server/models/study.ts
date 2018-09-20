'use strict';

import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import DataLoader from 'dataloader';
import DicomNameToTag from '../constants/dicomNameToTag.json';
import moment from 'moment';

import {
  GQLContrastPresentEnum,
  GQLReadTypeEnum,
  GQLStudyStatusEnum,
  GQLStudyLateralityEnum,
  GQLPermissionEnum,
  GQLNoteTypeEnum,
  GQLStudySupportRequestStatusEnum,
  StudyToNotesResolver,
} from '../graphql/types';
import DatePresets from '../constants/datePresets';
import { FilterQuery } from 'mongodb';
import { assignResultsToKeysMany } from '../utils/provideDataloaders';
import escapeStringRegexp from 'escape-string-regexp';
import { getPathForColumnKey } from '../constants/studyTableColumns';

import getGraphqlContext, { GQLContext } from '../utils/getGraphqlContext';
import { cStudyDescription } from './studyDescription';
import { cUser } from './user';
import { cFacility } from './facility';

export type MStudyReport = {
  content: any;
  signedOffDate: Date;
};
// _s prefix represents derived fields used for listing&searching, not business logic

export type MStudyNoteMessage = {
  createdById: ObjectId;
  createdTime: Date;
  text: String;
};

export type MStudyNote = {
  _id: ObjectId;
  type: GQLNoteTypeEnum;
  messages: MStudyNoteMessage[];
  resolved: Boolean;
};

export type MStudy = {
  _id: ObjectId;
  arriveTimeStart: Date;
  patientName: string;
  patientDOB: Date;
  patientId: string;
  patientSex: string;
  studyDescriptionId: ObjectId;
  _sStudyDescription: string;
  _sModality: string;
  _sFacilityName: string;
  studyPriority: string;
  studyStatus: GQLStudyStatusEnum;
  supportRequestStatus: GQLStudySupportRequestStatusEnum;
  readType: GQLReadTypeEnum;
  laterality: GQLStudyLateralityEnum;
  history: string;
  contrastPresent: GQLContrastPresentEnum;
  contrastType: string;
  dicomTags: { [K in keyof typeof DicomNameToTag]: string };
  noOfImages: number;
  sizeOfStudy: number;
  facilityId: ObjectId;
  referringPhysicianIds: Array<ObjectId>;
  assignedToId?: ObjectId;
  notes: MStudyNote[];
  _sAssignedRadiologistName: string;
  report?: MStudyReport;
  reportDeadline?: Number;
  addendums: MStudyReport[];
};

export function cStudy() {
  return getDb().collection<MStudy>('study');
}

export async function getStudyById(ctx: GQLContext, studyId: ObjectId) {
  checkPerms(ctx);

  return cStudy().findOne({ _id: studyId });
}

export async function getStudies(
  ctx: GQLContext,
  {
    filters,
    search = null,
    sorting = [],
    limit = 4,
    skip = 0,
    selectColumns = null,
    onlyTotalCount = false,
  },
) {
  const { permissions, user } = ctx;
  checkPerms(ctx);

  if (
    !permissions.includes(GQLPermissionEnum.LIST_ALL_STUDIES) &&
    !permissions.includes(GQLPermissionEnum.LIST_ALLOWED_STUDIES) &&
    !permissions.includes(GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME)
  ) {
    return { studies: [], totalCount: 0 };
  }

  let query: any = {};
  const filter = {};
  if (filters && filters.length) {
    const qry = [];
    filters.forEach(filter => {
      const js = {};
      if (filter.type === 'EQUAL_NUMBER') {
        js[getPathForColumnKey(filter.columnName)] = filter.numberValue;
      } else if (filter.type === 'DATE_RANGE') {
        const start = moment(filter.startDate);
        const end = moment(filter.endDate).endOf('day');
        console.log(start, end);
        js[getPathForColumnKey(filter.columnName)] = {
          $gte: start,
          $lt: end,
        };
      } else if (filter.type === 'DATE_PRESET') {
        const { start, end } = DatePresets[filter.datePreset].getDbRange();
        console.log(start, end);
        js[getPathForColumnKey(filter.columnName)] = {
          $gte: start,
          $lt: end,
        };
      } /*else if (filter.columnName === 'sharedWith') {
        js[filter.columnName] = {
          $elemMatch: {
            username: {
              $regex: escapeStringRegexp(filter.stringValue.trim()),
              $options: 'i',
            },
          },
        };
      }*/ else {
        js[getPathForColumnKey(filter.columnName)] = {
          $regex: escapeStringRegexp(filter.stringValue.trim()),
          $options: 'i',
        };
      }
      qry.push(js);
    });
    // @ts-ignore
    query.$and = qry;
  } /*else if (search) {
    const regex = { $regex: escapeStringRegexp(search), $options: 'i' };
    const searchQuery: any = {};
    const searchObj = [];
    searchQuery.$or = [
      {
        patientsName: regex,
      },
      {
        patientID: regex,
      },
      {
        accessionNumber: regex,
      },
      {
        readType: regex,
      },
      {
        studyType: regex,
      },
      {
        modality: regex,
      },
      {
        studyPriority: regex,
      },
      {
        facilityName: regex,
      },
    ];

    if (!isNaN(parseInt(search))) {
      searchQuery.$or.push({ noofImages: Number(search) });
      searchQuery.$or.push({ imageDictated: Number(search) });
    }

    searchObj.push(searchQuery);

    query.$and = searchObj;
  }*/

  const sort = [];
  sorting.forEach(s => {
    sort.push([getPathForColumnKey(s.columnName), s.order]);
  });

  if (
    (permissions.includes(GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME) ||
      permissions.includes(GQLPermissionEnum.LIST_ALLOWED_STUDIES)) &&
    !permissions.includes(GQLPermissionEnum.LIST_ALL_STUDIES)
  ) {
    const allowedFacilityIds = user.allowedFacilityIds || [];
    if (
      permissions.includes(GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME) &&
      permissions.includes(GQLPermissionEnum.LIST_ALLOWED_STUDIES)
    ) {
      query.$or = [{ assignedToId: user._id }, { facilityId: { $in: allowedFacilityIds } }];
    } else if (permissions.includes(GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME)) {
      query.assignedToId = user._id;
    } else {
      query.facilityId = { $in: allowedFacilityIds };
    }
  }

  /*
  if (permissions && permissions.title === 'View All Studies') {
  } else if (permissions && permissions.title === 'View Only Assigned Studies') {
    query.$or = [
      { sharedWith: { $elemMatch: { user: { $eq: user.email } } } },
      { radiologistAssigned: user._id },
    ];
  } else if (permissions && permissions.title === 'Studies Under Assigned Facility') {
    if (user.facilitie) {
      let facility = user.facilitie.map(data => {
        return data.institutionName;
      });
      query.facilityName = { $in: facility };
    }
  } else if (permissions && permissions.title === 'Assigned Study in Facility') {
    query.$or = [
      { sharedWith: { $elemMatch: { user: { $eq: user.email } } } },
      { referWith: { $elemMatch: { user: { $eq: user.email } } } },
    ];
    if (user.facilitie) {
      let facility = user.facilitie.map(data => {
        return data.institutionName;
      });
      query.facilityName = { $in: facility };
    }
  } else {
    // query = {};
  }*/

  // filter.populate = ['report'];
  const [studies, totalCount] = await Promise.all([
    onlyTotalCount
      ? null
      : cStudy()
          .find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .toArray(),
    cStudy()
      .find(query)
      .count(),
  ]);

  return {
    studies,
    totalCount,
  };
}

type ConfirmStudyDetails = Pick<
  MStudy,
  | 'patientName'
  | 'patientId'
  | 'patientDOB'
  | 'patientSex'
  | 'studyDescriptionId'
  | 'studyPriority'
  | 'readType'
  | 'laterality'
  | 'history'
  | 'contrastPresent'
  | 'contrastType'
  | 'referringPhysicianIds'
>;

export async function confirmStudy(
  ctx: GQLContext,
  studyId: ObjectId,
  studyDetails: ConfirmStudyDetails,
) {
  checkPerms(ctx, [GQLPermissionEnum.CONFIRM_STUDY]);

  const [studyDescription, study] = await Promise.all([
    cStudyDescription().findOne({
      _id: studyDetails.studyDescriptionId,
    }),
    cStudy().findOne({ _id: studyId }),
  ]);

  const facility = await cFacility().findOne({ _id: study.facilityId });

  const studyPriority = studyDetails.studyPriority;
  const tatLimit = facility.techConf.tatLimits.find(req => req.studyPriority === studyPriority);
  const tatLimitDate = tatLimit
    ? moment()
        .add(tatLimit.timeSeconds, 'seconds')
        .toDate()
    : null;

  return (await cStudy().findOneAndUpdate(
    { _id: studyId },
    {
      $set: {
        ...studyDetails,
        _sStudyDescription: studyDescription.name,
        _sModality: studyDescription.modality,
        studyStatus: GQLStudyStatusEnum.CONFIRMED,
        tatLimitDate,
      },
    },
    { returnOriginal: false },
  )).value;
}

export async function getPriorStudiesForStudy(ctx: GQLContext, study: MStudy) {
  checkPerms(ctx);

  const studyId = study._id;
  const issuerofPatientID = study.dicomTags.IssuerOfPatientID;
  const patientName = study.patientName;

  return cStudy()
    .find({
      'dicomTags.IssuerOfPatientID': issuerofPatientID,
      patientName,
      studyStatus: { $ne: GQLStudyStatusEnum.NEW },
      _id: { $ne: studyId },
    })
    .toArray();
}

export async function updateStudyFacility(
  ctx: GQLContext,
  studyIds: ObjectId[],
  facilityId: ObjectId,
): Promise<MStudy[]> {
  const facility = await cFacility().findOne({ _id: facilityId });
  await cStudy().updateMany(
    { _id: { $in: studyIds } },
    { $set: { facilityId, _sFacilityName: facility.institutionName } },
  );

  return cStudy()
    .find({ _id: { $in: studyIds } })
    .toArray();
}

export async function loadPendingStudiesForRadiologist(ctx: GQLContext, radiologistId: ObjectId) {
  if (!ctx._loaders.pendingStudiesForRadiologist) {
    ctx._loaders.pendingStudiesForRadiologist = new DataLoader(async keys => {
      const dbResult = await cStudy()
        .find({ assignedToId: { $in: keys }, studyStatus: GQLStudyStatusEnum.ASSIGNED })
        .toArray();
      return assignResultsToKeysMany(keys, dbResult, 'assignedToId');
    });
  }

  return ctx._loaders.pendingStudiesForRadiologist.load(radiologistId);
}

export async function signOffReport(ctx: GQLContext, studyId: ObjectId, content: any) {
  checkPerms(ctx);

  return (await cStudy().findOneAndUpdate(
    { _id: studyId },
    {
      $set: {
        report: { content, signedOffDate: new Date() },
        studyStatus: GQLStudyStatusEnum.SIGNED_OFF,
      },
    },
    { returnOriginal: false },
  )).value;
}

export async function signOffAddendum(ctx: GQLContext, studyId: ObjectId, content: any) {
  checkPerms(ctx);

  return (await cStudy().findOneAndUpdate(
    { _id: studyId },
    {
      $push: {
        addendums: {
          content,
          signedOffDate: new Date(),
        },
      },
    },
    { returnOriginal: false },
  )).value;
}

/*export async function getPendingStudiesForRadiologist(ctx: GQLContext, radiologistId: ObjectId) {
  checkPerms(ctx);

  return cStudy()
    .find({ assignedTo: radiologistId, status: GQLStudyStatusEnum.ASSIGNED })
    .toArray();
}*/

export async function assignStudiesToRadiologist(
  ctx: GQLContext,
  radiologistId: ObjectId,
  studyIds: ObjectId[],
) {
  checkPerms(ctx, [GQLPermissionEnum.ASSIGN_STUDY]);

  const radiologist = await cUser().findOne({ _id: radiologistId });
  return cStudy().updateMany(
    { _id: { $in: studyIds } },
    {
      $set: {
        assignedToId: radiologistId,
        studyStatus: GQLStudyStatusEnum.ASSIGNED,
        _sAssignedRadiologistName: `${radiologist.lastName} ${radiologist.firstName}`,
      },
    },
  );
}

export async function addStudyNote(
  ctx: GQLContext,
  studyId: ObjectId,
  title: String,
  text: String,
  type: GQLNoteTypeEnum,
) {
  await cStudy().update(
    { _id: studyId },
    {
      $push: {
        notes: {
          _id: new ObjectId(),
          title,
          resolved: false,
          type,
          messages: [
            {
              text: text,
              createdById: ctx.user._id,
              createdTime: new Date(),
            },
          ],
        },
      },
    },
  );

  await updateNoteRequestState(studyId);

  return cStudy().findOne({ _id: studyId });
}

export async function addStudyNoteMessage(
  ctx: GQLContext,
  studyId: ObjectId,
  noteId: ObjectId,
  text: String,
  resolved: boolean,
) {
  const update = {
    $push: {
      'notes.$.messages': {
        text: text,
        createdById: ctx.user._id,
        createdTime: new Date(),
      },
    },
  };
  if (typeof resolved === 'boolean') {
    update['$set'] = {
      'notes.$.resolved': resolved,
    };
  }
  await cStudy().updateOne({ _id: studyId, 'notes._id': noteId }, update);

  await updateNoteRequestState(studyId);

  return cStudy().findOne({ _id: studyId });
}

export async function updateNoteRequestState(studyId) {
  return Promise.all([
    // if there is at least one SUPPORT_REQUEST note which is unresolved -> PENDING
    cStudy().updateOne(
      {
        _id: studyId,
        notes: {
          $elemMatch: {
            type: {
              $in: [GQLNoteTypeEnum.SUPPORT_STUDY_REQUEST, GQLNoteTypeEnum.SUPPORT_URGENCY_REQUEST],
            },
            resolved: false,
          },
        },
      },
      { $set: { supportRequestStatus: GQLStudySupportRequestStatusEnum.PENDING } },
    ),
    // if there is some SUPPORT_REQUEST note, but no with resolved: false -> RESOLVED
    cStudy().updateOne(
      {
        _id: studyId,
        'notes.type': {
          $in: [GQLNoteTypeEnum.SUPPORT_STUDY_REQUEST, GQLNoteTypeEnum.SUPPORT_URGENCY_REQUEST],
        },
        notes: {
          $not: {
            $elemMatch: {
              type: {
                $in: [
                  GQLNoteTypeEnum.SUPPORT_STUDY_REQUEST,
                  GQLNoteTypeEnum.SUPPORT_URGENCY_REQUEST,
                ],
              },
              resolved: false,
            },
          },
        },
      },
      { $set: { supportRequestStatus: GQLStudySupportRequestStatusEnum.RESOLVED } },
    ),
  ]);
}
