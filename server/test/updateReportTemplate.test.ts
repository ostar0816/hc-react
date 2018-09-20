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
describe('updateReportTemplate', () => {
  it('update', async () => {
    const { insertedId: reportTemplateId } = await cReportTemplate().insertOne(
      DummyData.reportTemplate[0],
    );

    const rootValue = {};
    const variables = {
      reportTemplateId: reportTemplateId,
      ...DummyData.reportTemplate[1],
    };
    const context = { ...(await getGraphqlContext()), user: {}, permissions: [] };
    const query = /* GraphQL */ `
      mutation updateReportTemplate(
        $reportTemplateId: ObjectId!
        $name: String!
        $description: String!
        $template: JSON!
      ) {
        updateReportTemplate(
          reportTemplateId: $reportTemplateId
          name: $name
          description: $description
          template: $template
        ) {
          name
          description
          template
        }
      }
    `;

    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;
    expect(data).toMatchSnapshot();
  });
});
