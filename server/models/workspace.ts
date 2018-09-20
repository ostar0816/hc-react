'use strict';

import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import { GQLContext } from '../utils/getGraphqlContext';

export type MWorkspace = {
  _id: ObjectId;
  name: string;
  layout: any;
  userId: ObjectId;
};

export function cWorkspace() {
  return getDb().collection<MWorkspace>('workspace');
}

export async function getOrCreateWorkspaces(ctx: GQLContext) {
  checkPerms(ctx);

  const { user } = ctx;
  const workspaces = await cWorkspace()
    .find({
      userId: user._id,
    })
    .toArray();

  if (workspaces.length === 0) {
    const layout = null;
    const result = await cWorkspace().insertOne({
      name: 'Default',
      userId: user._id,
      layout: null,
    });

    const newWorkspace = result.ops[0];
    return [newWorkspace];
  }

  return workspaces;
}

export async function updateWorkspace(ctx: GQLContext, workspaceId: ObjectId, layout: any) {
  checkPerms(ctx);
  return (await cWorkspace().findOneAndUpdate(
    { _id: workspaceId },
    { $set: { layout } },
    { returnOriginal: false },
  )).value;
}
