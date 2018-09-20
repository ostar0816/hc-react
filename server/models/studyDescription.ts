'use strict';
import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
// import mongoose from 'mongoose';
// const { Schema } = mongoose;
import { GQLModalityEnum, GQLContrastEnum } from '../graphql/types';
import { GQLContext } from '../utils/getGraphqlContext';

export type MStudyDescription = {
  _id: ObjectId;
  name: string;
  modality: GQLModalityEnum;
  contrast: GQLContrastEnum;
  reportTemplateId?: ObjectId;
};

export function cStudyDescription() {
  return getDb().collection<MStudyDescription>('studyDescription');
}

export async function addStudyDescription(
  ctx: any,
  studyDescription: Omit<MStudyDescription, '_id'>,
) {
  checkPerms(ctx);

  return cStudyDescription().insertOne(studyDescription);
}

export async function loadStudyDescriptionById(ctx: GQLContext, studyDescriptionId: ObjectId) {
  checkPerms(ctx);

  return cStudyDescription().findOne({ _id: studyDescriptionId });
}

export async function listStudyDescriptions(ctx: GQLContext) {
  checkPerms(ctx);

  return cStudyDescription()
    .find({})
    .sort([['modality', 1], ['name', 1]])
    .toArray();
}

export async function updateStudyDescription(
  ctx: GQLContext,
  studyDescriptionId: ObjectId,
  studyDescription: Omit<MStudyDescription, '_id'>,
) {
  checkPerms(ctx);

  return (await cStudyDescription().findOneAndUpdate(
    { _id: studyDescriptionId },
    {
      $set: studyDescription,
    },
    { returnOriginal: false },
  )).value;
}

export async function deleteStudyDescription(ctx: GQLContext, studyDescriptionId: ObjectId) {
  checkPerms(ctx);

  return cStudyDescription().deleteOne({ _id: studyDescriptionId });
}
