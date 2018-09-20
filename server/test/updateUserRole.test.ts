import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cUser } from '../models/user';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('updateReportTemplate', () => {
  it('update', async () => {
    const { insertedId: userRoleId } = await cUserRole().insertOne(DummyData.userRole[0]);

    const rootValue = {};
    const variables = {
      userRoleId: userRoleId,
      ...DummyData.userRole[1],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateUserRole(
        $userRoleId: ObjectId!
        $name: String!
        $description: String!
      ) {
        updateUserRole(
          userRoleId: $userRoleId
          name: $name
          description: $description
        ) {
          name
          description
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
