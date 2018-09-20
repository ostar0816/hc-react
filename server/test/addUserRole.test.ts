import { graphql } from 'graphql';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);
describe('addUserRole', () => {
  it('add', async () => {
    await cUserRole().insertOne(DummyData.userRole[0]);

    const rootValue = {};
    const variables = {
      ...DummyData.userRole[1],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation addUserRole(
        $name: String!
        $description: String!
      ) {
        addUserRole(
          name: $name
          description: $description
        ) {
          viewer {
            userRoles {
              name
              description
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
