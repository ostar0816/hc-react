import { GQLFacilityTypeResolver } from '../types';

import { listReferringPhysiciansForFacility } from '../../models/referringPhysician';
import { MFacility } from '../../models/facility';

export const facilityResolvers: GQLFacilityTypeResolver<MFacility> = {
  async referringPhysicians(facility, {}, ctx) {
    return listReferringPhysiciansForFacility(ctx, facility._id);
  },
};
