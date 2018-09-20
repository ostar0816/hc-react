import { resolveViewerType } from '../helpers';

import {
  confirmStudy,
  getStudyById,
  assignStudiesToRadiologist,
  signOffReport,
  signOffAddendum,
  addStudyNote,
  addStudyNoteMessage,
  updateStudyFacility,
} from '../../models/study';
import { updateWorkspace } from '../../models/workspace';

import {
  addWorklist,
  deleteWorklist,
  updateWorklist,
  updateWorklistDisplayOnTop,
} from '../../models/worklist';

import {
  addStudyDescription,
  deleteStudyDescription,
  updateStudyDescription,
} from '../../models/studyDescription';

import {
  addFacility,
  updateFacility,
  updateFacilityTechConf,
  getFacilityById,
  updateFacilityDicomDetails,
} from '../../models/facility';

import {
  addReferringPhysician,
  updateReferringPhysician,
  deleteReferringPhysician,
} from '../../models/referringPhysician';

import {
  addReportTemplate,
  updateReportTemplate,
  deleteReportTemplate,
} from '../../models/reportTemplate';

import {
  login,
  addUser,
  updateUser,
  getUserById,
  updateAssignPriorities,
  updateAllowedFacilitiesForUser,
} from '../../models/user';

import { addUserRole, updateUserRole, updateUserRolePermissions } from '../../models/userRole';

import { GQLMutationTypeResolver } from '../../graphql/types';

export const mutationResolvers: GQLMutationTypeResolver<any> = {
  async login(_, { email, password }, context) {
    const user = await login({ email, password, req: context.req });
    //
    context.user = user;
    return { viewer: resolveViewerType() };
  },
  async logout(_, {}, context) {
    const { req } = context;
    req.session.destroy(err => {
      if (err) {
        throw err;
      }
      context.user = null;

      return { viewer: resolveViewerType() };
    });
  },
  async addWorklist(_, worklist, ctx) {
    await addWorklist(ctx, { ...worklist, userId: ctx.user._id, displayOnTop: false });

    return { viewer: resolveViewerType() };
  },
  async updateWorklist(_, { worklistId, ...worklist }, ctx) {
    await updateWorklist(ctx, worklistId, worklist);

    return { viewer: resolveViewerType() };
  },

  async updateWorklistDisplayOnTop(_, { worklistId, displayOnTop }, ctx) {
    await updateWorklistDisplayOnTop(ctx, worklistId, displayOnTop);

    return { viewer: resolveViewerType() };
  },

  async deleteWorklist(_, { worklistId }, ctx) {
    await deleteWorklist(ctx, worklistId);

    return { viewer: resolveViewerType() };
  },
  async updateWorkspace(_, { workspaceId, layout }, ctx) {
    await updateWorkspace(ctx, workspaceId, layout);

    return { viewer: resolveViewerType() };
  },
  async addStudyDescription(_, studyDescription, ctx) {
    await addStudyDescription(ctx, studyDescription);

    return { viewer: resolveViewerType() };
  },
  async updateStudyDescription(_, { studyDescriptionId, ...studyDescription }, ctx) {
    return updateStudyDescription(ctx, studyDescriptionId, studyDescription);
  },
  async deleteStudyDescription(_, { studyDescriptionId }, ctx) {
    await deleteStudyDescription(ctx, studyDescriptionId);

    return { viewer: resolveViewerType() };
  },
  async addReportTemplate(_, reportTemplate, ctx) {
    await addReportTemplate(ctx, reportTemplate);

    return { viewer: resolveViewerType() };
  },
  async updateReportTemplate(_, { reportTemplateId, ...reportTemplate }, ctx) {
    return updateReportTemplate(ctx, reportTemplateId, reportTemplate);
  },
  async deleteReportTemplate(_, { reportTemplateId }, ctx) {
    await deleteReportTemplate(ctx, reportTemplateId);
    return { viewer: resolveViewerType() };
  },
  async addUserRole(_, userRole, ctx) {
    await addUserRole(ctx, userRole);

    return { viewer: resolveViewerType() };
  },
  async updateUserRole(_, { userRoleId, ...userRole }, ctx) {
    return updateUserRole(ctx, userRoleId, userRole);
  },
  async addUser(_, user, ctx) {
    await addUser(ctx, user);

    return { viewer: resolveViewerType() };
  },
  async updateUser(_, { userId, ...user }, ctx) {
    return updateUser(ctx, userId, user);
  },
  async updateUserRolePermissions(_, { userRolePermissions }, ctx) {
    await updateUserRolePermissions(ctx, userRolePermissions);
    return { viewer: resolveViewerType() };
  },
  async addFacility(_, facility, ctx) {
    await addFacility(ctx, facility);

    return { viewer: resolveViewerType() };
  },
  async updateFacility(_, { facilityId, ...facility }, ctx) {
    return await updateFacility(ctx, facilityId, facility);
  },
  async updateFacilityTechConf(_, { facilityId, ...facilityTechConf }, ctx) {
    return updateFacilityTechConf(ctx, facilityId, facilityTechConf);
  },
  async updateFacilityDicomDetails(_, { facilityId, ...facility }, ctx) {
    return updateFacilityDicomDetails(ctx, facilityId, facility);
  },
  async addReferringPhysician(_, referringPhysician, ctx) {
    await addReferringPhysician(ctx, referringPhysician);
    return getFacilityById(ctx, referringPhysician.facilityId);
  },
  async updateReferringPhysician(_, { referringPhysicianId, ...referringPhysician }, ctx) {
    return updateReferringPhysician(ctx, referringPhysicianId, referringPhysician);
  },
  async deleteReferringPhysician(_, { referringPhysicianId }, ctx) {
    const referringPhysician = await deleteReferringPhysician(ctx, referringPhysicianId);
    return getFacilityById(ctx, referringPhysician.facilityId);
  },
  async confirmStudy(_, { studyId, ...studyDetails }, ctx) {
    await confirmStudy(ctx, studyId, studyDetails);

    return getStudyById(ctx, studyId);
  },
  async updateAssignPriorities(_, { userId, assignPriorities }, ctx) {
    return updateAssignPriorities(ctx, userId, assignPriorities);
  },
  async assignStudiesToRadiologist(_, { radiologistId, studyIds }, ctx) {
    await assignStudiesToRadiologist(ctx, radiologistId, studyIds);
    return getUserById(ctx, radiologistId);
  },
  async signOffReport(_, { studyId, content }, ctx) {
    return signOffReport(ctx, studyId, content);
  },
  async signOffAddendum(_, { studyId, content }, ctx) {
    return signOffAddendum(ctx, studyId, content);
  },

  async addStudyNote(_, { studyId, title, text, type }, ctx) {
    return addStudyNote(ctx, studyId, title, text, type);
  },
  async addStudyNoteMessage(_, { studyId, noteId, text, resolved }, ctx) {
    return addStudyNoteMessage(ctx, studyId, noteId, text, resolved);
  },
  async updateAllowedFacilitiesForUser(_, { userId, facilityIds }, ctx) {
    return updateAllowedFacilitiesForUser(ctx, userId, facilityIds);
  },
  async updateStudyFacility(_, { studyIds, facilityId }, ctx) {
    return updateStudyFacility(ctx, studyIds, facilityId);
  },
};
