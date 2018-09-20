'use strict';
import moment from 'moment';
import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;
import { GQLAssignPriorityEnum, GQLStudyStatusEnum } from '../graphql/types';
import { MStudy } from './study';
import { MFacility } from './facility';
import { MStudyDescription } from './studyDescription';
import { GQLContext } from '../utils/getGraphqlContext';

export type MUserAssignPriority = {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: GQLAssignPriorityEnum;
};

export type MUser = {
  _id: ObjectId;
  fmId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  assignPriorities: Array<MUserAssignPriority>;
  allowedFacilityIds: Array<ObjectId>;
  radiologyCapacity: number;
  userRoleId: ObjectId;
  lastSeenOnline: Date;
};

export function cUser() {
  return getDb().collection<MUser>('user');
}

export function getUserDefaults() {
  return {
    assignPriorities: [],
  };
}

export async function getUserById(ctx: GQLContext, userId: ObjectId) {
  checkPerms(ctx);

  return ctx.loaders.User.load(userId);
}

export async function comparePassword(currentPassword: string, passwordToCheck: string) {
  return bcrypt.compare(passwordToCheck, currentPassword);
}

export async function addUser(
  ctx: GQLContext,
  user: Pick<MUser, 'email' | 'password' | 'firstName' | 'lastName' | 'userRoleId'>,
) {
  checkPerms(ctx);

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(user.password, salt);

  cUser().insertOne({ ...getUserDefaults(), ...user, password: hash });
}

export async function updateUser(
  ctx: GQLContext,
  userId: ObjectId,
  user: Pick<MUser, 'email' | 'firstName' | 'lastName' | 'userRoleId'> & { password?: string },
) {
  checkPerms(ctx);

  let hash = '';
  if (user.password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    hash = await bcrypt.hash(user.password, salt);
  }

  return (await cUser().findOneAndUpdate(
    { _id: userId },
    {
      $set: user.password ? { ...user, password: hash } : user,
    },
    { returnOriginal: false },
  )).value;
}

export async function listUsers(ctx: GQLContext) {
  checkPerms(ctx);

  return cUser()
    .find({})
    .sort([['lastName', 1]])
    .toArray();
}

export async function login({ email, password, req }) {
  const user = await cUser().findOne({ email: email });

  if (user) {
    if (comparePassword(user.password, password)) {
      await new Promise((resolve, reject) => {
        req.session.regenerate(err => {
          if (err) {
            return reject(err);
          }
          req.session.userId = user._id;
          resolve();
        });
      });
      return user;
    }
  }
}

export async function updateAssignPriorities(
  ctx: GQLContext,
  userId: ObjectId,
  assignPriorities: Array<MUserAssignPriority>,
) {
  checkPerms(ctx);

  return (await cUser().findOneAndUpdate(
    { _id: userId },
    { $set: { assignPriorities } },
    { returnOriginal: false },
  )).value;
}

function applyAssignPriorities(
  radiologists: MUser[],
  study: MStudy,
  facility: MFacility,
  studyDescription: MStudyDescription,
) {
  return radiologists.map(radiologist => {
    let assignPriority: GQLAssignPriorityEnum = GQLAssignPriorityEnum.ZERO;

    radiologist.assignPriorities.forEach(ap => {
      if (
        (!ap.facilityNameRegex.length ||
          RegExp(ap.facilityNameRegex).test(facility.institutionName)) &&
        (!ap.studyDescriptionModalityRegex.length ||
          RegExp(ap.studyDescriptionModalityRegex).test(studyDescription.modality)) &&
        (!ap.studyDescriptionNameRegex.length ||
          RegExp(ap.studyDescriptionNameRegex).test(studyDescription.name)) &&
        (!ap.studyPriorityRegex.length || RegExp(ap.studyPriorityRegex).test(study.studyPriority))
      ) {
        assignPriority = ap.assignPriority;
      }
    });

    return {
      radiologist,
      assignPriority,
    };
  });
}

export async function getAssignOptionsForStudy(ctx: GQLContext, study: MStudy) {
  if (
    !(
      study.studyStatus === GQLStudyStatusEnum.CONFIRMED ||
      study.studyStatus === GQLStudyStatusEnum.ASSIGNED
    )
  ) {
    return [];
  }

  const [facility, studyDescription]: [MFacility, MStudyDescription] = await Promise.all([
    ctx.loaders.Facility.load(study.facilityId),
    ctx.loaders.StudyDescription.load(study.studyDescriptionId),
  ]);

  const rads: MUser[] = await ctx.loaders.User.loadMany(facility.assignedRadiologistIds);

  return applyAssignPriorities(rads, study, facility, studyDescription);
}

export async function updateAllowedFacilitiesForUser(
  ctx: GQLContext,
  userId: ObjectId,
  facilityIds: ObjectId[],
): Promise<MUser> {
  return (await cUser().findOneAndUpdate(
    { _id: userId },
    { $set: { allowedFacilityIds: facilityIds } },
    { returnOriginal: false },
  )).value;
}
/*
const UserSchema = new Schema(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    passwordToken: String,
    passwordExpires: Date,
    status: Number,
    userRole: { type: ObjectId, required: true, ref: 'UserRole' },

    userImage: String,
    medPoint: { type: Boolean, required: true, default: false },
    autoDeliver: { type: Boolean, required: true, default: false },
    editStatus: { type: Boolean, default: true },
    facilities: [{ type: ObjectId, ref: 'Facility' }],
    userData: {
      agent: { type: String },
      referrer: { type: String },
      ip: { type: String },
      lastlogin: { type: Date },
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

mongoose.model('User', UserSchema, 'user');
*/
