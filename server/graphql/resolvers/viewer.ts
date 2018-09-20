import graphqlFields from 'graphql-fields';
import { GQLViewerTypeResolver } from '../types';

import { getStudies, getStudyById } from '../../models/study';
import { getUserById, listUsers } from '../../models/user';
import { getFacilityById, listFacilities } from '../../models/facility';
import { listStudyDescriptions } from '../../models/studyDescription';
import { listReportTemplates } from '../../models/reportTemplate';
import { listUserRole } from '../../models/userRole';

export const viewerResolvers: GQLViewerTypeResolver<any> = {
  async searchStudies(_, { skip, limit, sorting, filters }, ctx, ast) {
    const fields = graphqlFields(ast);

    const selectColumns = {};
    Object.keys(fields.studies).forEach(col => {
      if (col !== '__typename') {
        selectColumns[col] = 1;
      }
    });

    const { studies, totalCount } = await getStudies(ctx, {
      search: '',
      skip,
      limit,
      sorting,
      filters,
      selectColumns,
    });

    return {
      totalCount,
      studies,
    };
  },
  async searchStudyById(_, { studyId }, ctx) {
    if (!studyId) {
      return null;
    }
    return getStudyById(ctx, studyId);
  },
  async searchUserById(_, { userId }, ctx) {
    if (!userId) {
      return null;
    }

    return getUserById(ctx, userId);
  },
  async searchFacilityById(_, { facilityId }, ctx) {
    if (!facilityId) {
      return null;
    }

    return getFacilityById(ctx, facilityId);
  },
  async user(_, {}, { user }) {
    return user;
  },
  async studyDescriptions(_, {}, ctx) {
    return listStudyDescriptions(ctx);
  },
  facilities(_, {}, ctx) {
    return listFacilities(ctx);
  },
  reportTemplates(_, {}, ctx) {
    return listReportTemplates(ctx);
  },
  userRoles(_, {}, ctx) {
    return listUserRole(ctx);
  },
  users(_, {}, ctx) {
    return listUsers(ctx);
  },
};
