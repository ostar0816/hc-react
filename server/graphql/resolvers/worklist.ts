import { GQLWorklistTypeResolver } from '../types';

import { getStudies } from '../../models/study';
import { MWorklist } from '../../models/worklist';

export const worklistResolvers: GQLWorklistTypeResolver<MWorklist> = {
  async totalCount(worklist, {}, ctx) {
    if (!worklist.displayOnTop) {
      return null;
    }

    const filters = worklist.columns
      .filter(c => !!c.filter)
      .map(c => ({ ...c.filter, columnName: c.key }));
    const { totalCount } = await getStudies(ctx, { filters, onlyTotalCount: true });
    return totalCount;
  },
};
