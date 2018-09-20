import { GQLStudyDescriptionTypeResolver } from '../types';

import { getReportTemplateById } from '../../models/reportTemplate';
import { MStudyDescription } from '../../models/studyDescription';

export const studyDescriptionResolvers: GQLStudyDescriptionTypeResolver<MStudyDescription> = {
  async reportTemplate(studyDescription, {}, ctx) {
    if (!studyDescription.reportTemplateId) {
      return null;
    }
    return getReportTemplateById(ctx, studyDescription.reportTemplateId);
  },
};
