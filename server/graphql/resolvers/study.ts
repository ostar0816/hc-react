import { GQLStudyTypeResolver } from '../types';
import StudyTableColumns from '../../constants/studyTableColumns';

import { MStudy, getPriorStudiesForStudy } from '../../models/study';
import { getUserById, getAssignOptionsForStudy } from '../../models/user';
import { getFacilityById } from '../../models/facility';
import { loadStudyDescriptionById } from '../../models/studyDescription';
import { loadReferringPhysicianByIds } from '../../models/referringPhysician';

export const studyResolvers: GQLStudyTypeResolver<MStudy> = {
  referringPhysicians(study, {}, ctx) {
    return loadReferringPhysicianByIds(ctx, study.referringPhysicianIds);
  },
  studyDescription(study, {}, ctx) {
    if (!study.studyDescriptionId) {
      return null;
    }
    return loadStudyDescriptionById(ctx, study.studyDescriptionId);
  },
  facility(study, {}, ctx) {
    return getFacilityById(ctx, study.facilityId);
  },
  assignedTo(study, {}, ctx) {
    if (!study.assignedToId) {
      return null;
    }

    return getUserById(ctx, study.assignedToId);
  },
  canBeAssignedTo(study, {}, ctx) {
    return getAssignOptionsForStudy(ctx, study);
  },
  priorStudies(study, {}, ctx) {
    return getPriorStudiesForStudy(ctx, study);
  },
};

// add custom resolvers for studyType
Object.keys(StudyTableColumns).forEach(columnKey => {
  const col = StudyTableColumns[columnKey];
  if (col.path) {
    studyResolvers[columnKey] = study => {
      const parts = col.path.split('.');
      let value = study;
      for (let i = 0; i < parts.length; i++) {
        if (value === undefined) {
          return null;
        }
        value = value[parts[i]];
      }
      return value;
    };
  }
});
