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

describe('deleteReferringPhysician', () => {
  it('delete', async () => {
    const { insertedId: facilityId } = await cFacility().insertOne(DummyData.facility[0]);
    const referringPhysician1 = (await cReferringPhysician().insertOne({
      ...DummyData.referringPhysian[0],
      facilityId: facilityId,
    })).ops[0];

    const referringPhysician2 = (await cReferringPhysician().insertOne({
      ...DummyData.referringPhysian[1],
      facilityId: facilityId,
    })).ops[0];

    const rootValue = {};
    const variables = {
      referringPhysicianId: referringPhysician2._id,
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation deleteReferringPhysician($referringPhysicianId: ObjectId!) {
        deleteReferringPhysician(referringPhysicianId: $referringPhysicianId) {
          referringPhysicians {
            physicianUid
            name
            email
            phone
            fax
            dicomValue
          }
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
