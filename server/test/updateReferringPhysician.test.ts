import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cFacility } from '../models/facility';
import { cReferringPhysician } from '../models/referringPhysician';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('updateReferringPhysician', () => {
  it('update', async () => {
    const { insertedId: facilityId } = await cFacility().insertOne(DummyData.facility[0]);
    const referringPhysicianId = (await cReferringPhysician().insertOne({
      ...DummyData.referringPhysian[0],
      facility: facilityId,
    })).insertedId;
    const rootValue = {};
    const variables = {
      referringPhysicianId: referringPhysicianId,
      ...DummyData.referringPhysian[1],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateReferringPhysician(
        $referringPhysicianId: ObjectId!
        $physicianUid: String!
        $name: String!
        $email: String!
        $phone: String!
        $fax: String!
        $dicomValue: String!
      ) {
        updateReferringPhysician(
          referringPhysicianId: $referringPhysicianId
          physicianUid: $physicianUid
          name: $name
          email: $email
          phone: $phone
          fax: $fax
          dicomValue: $dicomValue
        ) {
          physicianUid
          name
          email
          phone
          fax
          dicomValue
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
