import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cUser } from '../models/user';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';
import { cFacility } from '../models/facility';
import { cStudy, addStudyNote } from '../models/study';
import { GQLNoteTypeEnum } from '../graphql/types';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('addUserNoteMessage', () => {
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
    const context = { ...(await getGraphqlContext(userId1)) };
    const study = await addStudyNote(
      context,
      studyId,
      'Missing images',
      'There are missing images in first series.',
      GQLNoteTypeEnum.SUPPORT_STUDY_REQUEST,
    );

    const variables = {
      studyId,
      noteId: study.notes[0]._id,
      resolved: true,
      text: 'Images were upload, retrive them again.',
    };

    const query = /* GraphQL */ `
      mutation addStudyNoteMessage(
        $studyId: ObjectId!
        $noteId: ObjectId!
        $resolved: Boolean!
        $text: String!
      ) {
        addStudyNoteMessage(
          studyId: $studyId
          noteId: $noteId
          resolved: $resolved
          text: $text
        ) {
          supportRequestStatus
          notes{
            type
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
