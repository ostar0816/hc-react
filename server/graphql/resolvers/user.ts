import { GQLUserTypeResolver } from '../types';

import { loadPendingStudiesForRadiologist } from '../../models/study';
import { MUser } from '../../models/user';
import { getFacilitiesByAssignedPhysicianId, loadFacilityByIds } from '../../models/facility';
import { getOrCreateWorkspaces } from '../../models/workspace';
import { loadUserRoleById } from '../../models/userRole';
import { listWorklists } from '../../models/worklist';
import moment from 'moment';

export const userResolvers: GQLUserTypeResolver<MUser> = {
  userRole(user, {}, ctx) {
    if (!user.userRoleId) {
      return null;
    }
    return loadUserRoleById(ctx, user.userRoleId);
  },
  worklists(_, {}, ctx) {
    return listWorklists(ctx);
  },
  workspaces(_, {}, ctx) {
    return getOrCreateWorkspaces(ctx);
  },
  assignedFacilities(user, {}, ctx) {
    return getFacilitiesByAssignedPhysicianId(ctx, user._id);
  },
  allowedFacilities(user, {}, ctx) {
    if (user.allowedFacilityIds && user.allowedFacilityIds.length) {
      return loadFacilityByIds(ctx, user.allowedFacilityIds || []);
    }
    return [];
  },
  pendingStudies(user, {}, ctx) {
    return loadPendingStudiesForRadiologist(ctx, user._id);
  },
  online(user, {}, ctx) {
    const isOnline = user.lastSeenOnline
      ? moment(user.lastSeenOnline).isSameOrAfter(moment().subtract(5, 'minutes'))
      : false;

    return isOnline;
  },
};
