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

describe('addUser', () => {
  it('add', async () => {
    const { insertedId: userRoleId1 } = await cUserRole().insertOne(DummyData.userRole[0]);
    const { insertedId: userRoleId2 } = await cUserRole().insertOne(DummyData.userRole[1]);

    await cUser().insertOne({ ...DummyData.user[0], userRoleId: userRoleId1 });

    const rootValue = {};
    const variables = {
      ...DummyData.user[1],
      userRoleId: userRoleId2,
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation addUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $userRoleId: ObjectId!
      ) {
        addUser(
          firstName: $firstName
          lastName: $lastName
          email: $email
          password: $password
          userRoleId: $userRoleId
        ) {
          viewer {
            users {
              firstName
              lastName
              email
              userRole {
                name
              }
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
