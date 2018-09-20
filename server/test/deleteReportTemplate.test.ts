import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cReportTemplate } from '../models/reportTemplate';
import { cUserRole } from '../models/userRole';

import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('deleteReportTemplate', () => {
  it('delete', async () => {
    const { insertedId: reportTemplateId1 } = await cReportTemplate().insertOne(
      DummyData.reportTemplate[0],
    );
    const { insertedId: reportTemplateId2 } = await cReportTemplate().insertOne(
      DummyData.reportTemplate[1],
    );

    const rootValue = {};
    const variables = {
      reportTemplateId: reportTemplateId1,
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation deleteReportTemplate($reportTemplateId: ObjectId!) {
        deleteReportTemplate(reportTemplateId: $reportTemplateId) {
          viewer {
            reportTemplates {
              name
              description
              template
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
