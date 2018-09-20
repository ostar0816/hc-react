'use strict';
import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import {
  GQLReadTypeEnum,
  GQLContrastRequirement,
  GQLModalityEnum,
  GQLContrastRequirementsEnum,
  GQLPriorityTimeRequirement,
  GQLTATLimit,
} from '../graphql/types';
import { GQLContext } from '../utils/getGraphqlContext';

export type MFacilityBase = {
  _id: ObjectId;
  institutionName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  websiteUrl: string;
  faxNumber: string;
  phoneNumber: string;
  email: string;
};

export type MFacilityTechConf = {
  readType: GQLReadTypeEnum;
  contrastRequirements: Array<GQLContrastRequirement>;
  tatLimits: Array<GQLTATLimit>;
};

export type MFacilityDicomDetails = {
  AETitle: string;
};

export type MFacility = MFacilityBase & {
  techConf: MFacilityTechConf;
  dicomDetails: MFacilityDicomDetails;
  assignedRadiologistIds: Array<ObjectId>;
};

export function getFacilityDefaults() {
  return {
    techConf: {
      readType: GQLReadTypeEnum.PRELIM,
      contrastRequirements: [
        {
          modality: GQLModalityEnum.CT,
          requirement: GQLContrastRequirementsEnum.REQUIRED,
        },
        {
          modality: GQLModalityEnum.MR,
          requirement: GQLContrastRequirementsEnum.REQUIRED,
        },
      ],
      tatLimits: [],
    },
    dicomDetails: {
      AETitle: '',
    },
    assignedRadiologistIds: [],
  };
}

export function cFacility() {
  return getDb().collection<MFacility>('facility');
}

export async function listFacilities(ctx: GQLContext) {
  checkPerms(ctx);

  return cFacility()
    .find({})
    .sort([['institutionName', 1]])
    .toArray();
}

export async function getFacilitiesByAssignedPhysicianId(ctx, userId: ObjectId) {
  checkPerms(ctx);

  return cFacility()
    .find({ assignedRadiologistIds: userId })
    .sort([['institutionName', 1]])
    .collation({ locale: 'en', strength: 2 })
    .toArray();
}

export async function getFacilityById(ctx, facilityId: ObjectId): Promise<MFacility> {
  checkPerms(ctx);

  return ctx.loaders.Facility.load(facilityId);

  //return Facility.findOne({_id: facilityId}).exec();
}

export async function loadFacilityByIds(ctx, facilityIds: ObjectId[]): Promise<MFacility[]> {
  checkPerms(ctx);

  return ctx.loaders.Facility.loadMany(facilityIds);

  //return Facility.findOne({_id: facilityId}).exec();
}

export async function addFacility(ctx: GQLContext, facility: Omit<MFacilityBase, '_id'>) {
  checkPerms(ctx);

  return cFacility().insertOne({ ...getFacilityDefaults(), ...facility });
}

export async function updateFacility(
  ctx,
  facilityId: ObjectId,
  facility: Omit<MFacilityBase, '_id'>,
) {
  checkPerms(ctx);

  return (await cFacility().findOneAndUpdate(
    { _id: facilityId },
    {
      $set: facility,
    },
    { returnOriginal: false },
  )).value;
}

export async function updateFacilityTechConf(
  ctx: GQLContext,
  facilityId: ObjectId,
  facilityTechConf: MFacilityTechConf,
) {
  checkPerms(ctx);

  return (await cFacility().findOneAndUpdate(
    { _id: facilityId },
    { $set: { techConf: facilityTechConf } },
    { returnOriginal: false },
  )).value;
}

export async function updateFacilityDicomDetails(
  ctx: GQLContext,
  facilityId: ObjectId,
  facilityDicomDetails: MFacilityDicomDetails,
) {
  checkPerms(ctx);
  console.log(facilityId, facilityDicomDetails);
  return (await cFacility().findOneAndUpdate(
    { _id: facilityId },
    {
      $set: {
        dicomDetails: facilityDicomDetails,
      },
    },
    { returnOriginal: false },
  )).value;
}

/*
const Facility = new Schema(
  {
    institutionName: { type: String, unique: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    faxNumber: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: String,
    techConf: {
      readType: { type: String, default: 'PRELIM' },
      contrastRequirements: [
        {
          modality: { type: String },
          requirement: { type: String },
        },
      ],
    },
    dicomDetails: {
      AETitle: { type: String, default: '' },
    },
    // physicians: [{ type: ObjectId, ref: 'Physician'}],

    /*status: { type: String, default: 1, enum: [0, 1] },
      user: [{ type: ObjectId, required: true, ref: 'Users' }],
      logoUrl: { type: String, default: '' },
      note: { type: String, default: '' },
      AETitle: { type: String, default: '' },
      priorStudy: { type: Boolean, default: false },
      history: { type: Boolean, default: false },
      historyNote: { type: String, default: '' },
      retention: { type: Number, default: 90 },
      laterality: { type: String, default: '' },
      contrastStatus: { type: String, default: '' },
      priorStatus: { type: Number, default: 5 },
      studyType: { type: String, default: 'Final' },
      indication: { type: Boolean, default: false },*/
/*},
  { timestamps: true },
);

mongoose.model('Facility', Facility, 'facility');
*/
