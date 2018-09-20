import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';
import { GQLPermissionEnum } from '../graphql/types';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('updateUserRolePermissions', () => {
  it('update', async () => {
    const { insertedId: userRoleId1 } = await cUserRole().insertOne(DummyData.userRole[0]);
    const { insertedId: userRoleId2 } = await cUserRole().insertOne(DummyData.userRole[1]);

    const rootValue = {};
    const variables = {
      userRolePermissions: [
        {
          userRoleId: userRoleId1,
          permissions: [],
        },
        {
          userRoleId: userRoleId2,
          permissions: [
            GQLPermissionEnum.LIST_ALL_STUDIES,
            GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME,
          ],
        },
      ],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateUserRolePermissions($userRolePermissions: [UserRolePermissionsInput]) {
        updateUserRolePermissions(userRolePermissions: $userRolePermissions) {
          viewer {
            userRoles {
              name
              permissions
            }
          }
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
