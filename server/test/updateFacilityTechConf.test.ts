import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cUser } from '../models/user';
import { cFacility } from '../models/facility';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';
import { GQLStudyPriorityEnum } from '../graphql/types';
beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('updateFacilityTechConf', () => {
  it('update', async () => {
    const { insertedId: facilityId } = await cFacility().insertOne({
      institutionName: 'test facility',
    });
    const rootValue = {};
    const variables = {
      facilityId,
      contrastRequirements: [{ modality: 'CT', requirement: 'OPTIONAL' }],
      readType: 'PRELIM',
      tatLimits: [
        {
          timeSeconds: 120,
          studyPriority: GQLStudyPriorityEnum.ROUTINE,
        },
      ],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateFacilityTechConf(
        $facilityId: ObjectId!
        $contrastRequirements: [ContrastRequirementsInput]!
        $readType: ReadTypeEnum!
        $tatLimits: [TATLimitInput!]!
      ) {
        updateFacilityTechConf(
          facilityId: $facilityId
          contrastRequirements: $contrastRequirements
          readType: $readType
          tatLimits: $tatLimits
        ) {
          techConf {
            contrastRequirements {
              modality
              requirement
            }
            readType
            tatLimits {
              timeSeconds
              studyPriority
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
