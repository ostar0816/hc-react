import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cUser } from '../models/user';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';
import { cFacility } from '../models/facility';
import { cStudy } from '../models/study';
import { GQLNoteTypeEnum } from '../graphql/types';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('addUserNote', () => {
  it('add', async () => {
    const { insertedId: userRoleId1 } = await cUserRole().insertOne(DummyData.userRole[0]);

    const { insertedId: userId1 } = await cUser().insertOne({
      ...DummyData.user[0],
      userRoleId: userRoleId1,
    });
    const { insertedId: facilityId1 } = await cFacility().insertOne(DummyData.facility[0]);

    const { insertedId: studyId } = await cStudy().insertOne({
      ...DummyData.study[0],
      facilityId: facilityId1,
    });

    const rootValue = {};
    const variables = {
      studyId,
      type: GQLNoteTypeEnum.SUPPORT_STUDY_REQUEST,
      title: 'Missing images',
      text: 'There are missing images in first series.',
    };
    const context = { ...(await getGraphqlContext(userId1)) };
    const query = /* GraphQL */ `
      mutation addStudyNote(
        $studyId: ObjectId!
        $type: NoteTypeEnum!
        $title: String!
        $text: String!
      ) {
        addStudyNote(
          studyId: $studyId
          title: $title
          type: $type
          text: $text
        ) {
          supportRequestStatus
          notes{
            type
            title
            resolved
            messages {
              text
              createdBy {
                firstName
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
