'use strict';

import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import { GQLContext } from '../utils/getGraphqlContext';

export type MReferringPhysician = {
  _id: ObjectId;
  name: string;
  physicianUid: string;
  fax: string;
  phone: string;
  email: string;
  dicomValue: string;
  facilityId: ObjectId;
};

export function cReferringPhysician() {
  return getDb().collection<MReferringPhysician>('referringPhysician');
}

export async function loadReferringPhysicianByIds(ctx: GQLContext, referringPhysicianIds) {
  checkPerms(ctx);
  return ctx.loaders.ReferringPhysician.loadMany(referringPhysicianIds);
}

export async function addReferringPhysician(
  ctx: GQLContext,
  referringPhysician: Omit<MReferringPhysician, '_id'>,
) {
  checkPerms(ctx);

  return cReferringPhysician().insertOne(referringPhysician);
}

export async function updateReferringPhysician(
  ctx: GQLContext,
  referringPhysicianId: ObjectId,
  referringPhysician: Omit<MReferringPhysician, '_id' | 'facilityId'>,
) {
  checkPerms(ctx);

  return (await cReferringPhysician().findOneAndUpdate(
    { _id: referringPhysicianId },
    {
      $set: referringPhysician,
    },
    { returnOriginal: false },
  )).value;
}

export async function deleteReferringPhysician(ctx: GQLContext, referringPhysicianId: ObjectId) {
  checkPerms(ctx);

  return (await cReferringPhysician().findOneAndDelete({ _id: referringPhysicianId })).value;
}

export async function listReferringPhysiciansForFacility(ctx: GQLContext, facilityId: ObjectId) {
  checkPerms(ctx);

  return cReferringPhysician()
    .find({ facilityId })
    .sort([['name', 1]])
    .toArray();
}
