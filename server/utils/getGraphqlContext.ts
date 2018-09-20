import provideDataloaders from './provideDataloaders';
import { cUser, MUser } from '../models/user';
import { getPermissions } from '../models/userRole';
import { GQLPermissionEnum } from '../graphql/types';
import { Request } from 'express';

export type GQLContext = {
  user: MUser;
  permissions: GQLPermissionEnum[];
  loaders: ReturnType<typeof provideDataloaders>;
  req: Request;
  _loaders: any;
};

async function getGraphqlContext(userId): Promise<GQLContext> {
  const user = userId ? await cUser().findOne({ _id: userId }) : null;

  const permissions = user ? await getPermissions({ user }) : null;
  return {
    user,
    permissions,
    // req gets overiden in graphql resolver
    req: null,
    loaders: provideDataloaders(),
    _loaders: {},
  };
}

export default getGraphqlContext;
