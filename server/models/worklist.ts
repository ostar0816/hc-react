'use strict';
import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import { GQLFilterEnum } from '../graphql/types';
import { GQLContext } from '../utils/getGraphqlContext';

export type MWorklistSort = {
  order: number;
  columnName: string;
};

export type MWorklistFilter = {
  type: GQLFilterEnum;
  stringValue?: string;
  numberValue?: number;
  startDate?: Date;
  endDate?: Date;
  datePreset?: String;
};

export type MWorklistColumn = {
  key: string;
  width: number;
  filter?: MWorklistFilter;
};

export type MWorklist = {
  _id: ObjectId;
  name: string;
  description: string;
  sorting: Array<MWorklistSort>;
  columns: Array<MWorklistColumn>;
  userId: ObjectId;
  displayOnTop: boolean;
};

export function cWorklist() {
  return getDb().collection<MWorklist>('worklist');
}

export async function listWorklists(ctx: GQLContext) {
  checkPerms(ctx);

  const { user } = ctx;

  return await cWorklist()
    .find({ userId: user._id })
    .toArray();
}

export async function addWorklist(ctx: GQLContext, worklist: Omit<MWorklist, '_id'>) {
  checkPerms(ctx);

  const { user } = ctx;

  return cWorklist().insertOne(worklist);
}

export async function deleteWorklist(ctx: GQLContext, worklistId: ObjectId) {
  checkPerms(ctx);

  return cWorklist().findOneAndDelete({ _id: worklistId });
}

export async function updateWorklist(
  ctx: GQLContext,
  worklistId: ObjectId,
  worklist: Pick<MWorklist, 'sorting' | 'columns'>,
) {
  checkPerms(ctx);

  return cWorklist().findOneAndUpdate({ _id: worklistId }, { $set: worklist });
}

export async function updateWorklistDisplayOnTop(
  ctx: GQLContext,
  worklistId: ObjectId,
  displayOnTop: boolean,
) {
  checkPerms(ctx);

  return cWorklist().update({ _id: worklistId }, { $set: { displayOnTop } });
}

/*
let WorklistSchema = new Schema(
  {
    name: { type: String, required: true },
    worklistName: { type: String, required: true },
    uniqueName: { type: String },
    description: { type: String },
    status: { type: Boolean, default: true },
    url: { type: String },
    count: { type: Number },
    countStatus: { type: Boolean, default: true },
    user: { type: ObjectId, required: true, ref: 'Users' },
    usertype: { type: ObjectId, ref: 'Usertype' },
    ontop: { type: Boolean, default: false }, // TODO: remove
    displayOnTop: { type: Boolean, default: false },
    default: { type: Boolean },
    defaultStatus: { type: Boolean },
    fields: [
      // TODO: remove
      {
        display: { type: String, required: true },
        dbs: { type: String, required: true },
        status: { type: Boolean },
        search: { type: Boolean },
      },
    ],
    sorting: [{ columnName: { type: String }, order: { type: Number } }],
    columns: [
      {
        key: { type: String },
        width: { type: Number },
        filter: {
          type: { type: String },
          stringValue: { type: String },
          numberValue: { type: Number },
          startDate: { type: Date },
          endDate: { type: Date },
          datePreset: { type: String },
        },
      },
    ],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
*/
