import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cFacility } from '../models/facility';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('updateFacility', () => {
  it('update', async () => {
    const { insertedId: facilityId } = await cFacility().insertOne(DummyData.facility[0]);
    const rootValue = {};
    const variables = {
      facilityId: facilityId,
      institutionName: 'Awesome institution',
      address: 'Wallstreet 12',
      city: 'Log Angeles',
      state: 'California',
      zip: 'AA22D',
      websiteUrl: 'http://institut.1234',
      faxNumber: '1222222',
      phoneNumber: '7777888',
      email: 'awesome@institut.com',
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateFacility(
        $facilityId: ObjectId!
        $institutionName: String!
        $address: String!
        $city: String!
        $state: String!
        $zip: String!
        $websiteUrl: String!
        $faxNumber: String!
        $phoneNumber: String!
        $email: String!
      ) {
        updateFacility(
          facilityId: $facilityId
          institutionName: $institutionName
          address: $address
          city: $city
          state: $state
          zip: $zip
          websiteUrl: $websiteUrl
          faxNumber: $faxNumber
          phoneNumber: $phoneNumber
          email: $email
        ) {
          institutionName
          address
          city
          state
          zip
          websiteUrl
          faxNumber
          phoneNumber
          email
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
