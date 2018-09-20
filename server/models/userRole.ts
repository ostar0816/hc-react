'use strict';
import { getDb, ObjectId } from '../mongodb';
import checkPerms from '../utils/checkPerms';
import { Omit } from '../utils/tsTypes';
import { GQLPermissionEnum } from '../graphql/types';
import { GQLContext } from '../utils/getGraphqlContext';

export type MUserRole = {
  _id: ObjectId;
  name: string;
  // some roles needs static name so can be associated with users automatically
  builtInName: string;
  description: string;
  permissions: Array<GQLPermissionEnum>;
};

export function getUserRoleDefaults() {
  return {
    builtInName: '',
    permissions: [],
  };
}

export function cUserRole() {
  return getDb().collection<MUserRole>('userRole');
}

export async function getPermissions({ user }) {
  const userRole = await cUserRole().findOne({ _id: user.userRoleId });

  return userRole.permissions;
}

export async function loadUserRoleById(ctx: GQLContext, id) {
  checkPerms(ctx);
  return ctx.loaders.UserRole.load(id);
}

export async function addUserRole(
  ctx: GQLContext,
  userRole: Pick<MUserRole, 'name' | 'description'>,
) {
  checkPerms(ctx);

  return cUserRole().insertOne({ ...getUserRoleDefaults(), ...userRole });
}

export async function updateUserRole(
  ctx: GQLContext,
  userRoleId: ObjectId,
  userRole: Pick<MUserRole, 'name' | 'description'>,
) {
  checkPerms(ctx);

  return (await cUserRole().findOneAndUpdate(
    { _id: userRoleId },
    {
      $set: userRole,
    },
    {
      returnOriginal: false,
    },
  )).value;
}

type UserRolePermission = {
  userRoleId: ObjectId;
  permissions: Array<string>;
};
export async function updateUserRolePermissions(
  ctx: GQLContext,
  userRolePermissions: Array<UserRolePermission>,
) {
  const updates = userRolePermissions.map(async ({ userRoleId, permissions }) => {
    return (await cUserRole().findOneAndUpdate(
      { _id: userRoleId },
      {
        $set: {
          permissions,
        },
      },
      { returnOriginal: false },
    )).value;
  });

  return Promise.all(updates);
}

export async function listUserRole(ctx: GQLContext) {
  checkPerms(ctx);

  return cUserRole()
    .find({})
    .sort([['name', 1]])
    .toArray();
}
