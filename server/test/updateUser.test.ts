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

describe('updateUser', () => {
  it('update', async () => {
    const { insertedId: userRoleId1 } = await cUserRole().insertOne(DummyData.userRole[0]);
    const { insertedId: userRoleId2 } = await cUserRole().insertOne(DummyData.userRole[1]);

    const { insertedId: userId } = await cUser().insertOne({
      ...DummyData.user[0],
      userRole: userRoleId1,
    });

    const rootValue = {};
    const variables = {
      ...DummyData.user[1],
      userId,
      userRoleId: userRoleId2,
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateUser(
        $userId: ObjectId!
        $firstName: String!
        $lastName: String!
        $email: String!
        $userRoleId: ObjectId!
      ) {
        updateUser(
          userId: $userId
          firstName: $firstName
          lastName: $lastName
          email: $email
          userRoleId: $userRoleId
        ) {
          firstName
          lastName
          email
          userRole {
            name
          }
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;

    expect(data).toMatchSnapshot();
  });
});
