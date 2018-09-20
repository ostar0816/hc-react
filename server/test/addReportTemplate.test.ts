import { graphql } from 'graphql';
import { gql } from 'apollo-server';
import { cReportTemplate } from '../models/reportTemplate';
import * as DummyData from './dummyData';
import getGraphqlContext from '../utils/getGraphqlContext';
import { schema, connectMongo, clearDatabase, disconnectMongo } from './helpers';

beforeAll(connectMongo);

beforeEach(clearDatabase);

afterAll(disconnectMongo);

describe('addReportTemplate', () => {
  it('add', async () => {
    await cReportTemplate().insertOne(DummyData.reportTemplate[0]);

    const rootValue = {};
    const variables = {
      ...DummyData.reportTemplate[1],
    };
    const context = { ...getGraphqlContext(), user: {}, permissions: [] };
    const query = `
      mutation addReportTemplate($name: String!, $description: String!, $template: JSON!) {
        addReportTemplate(name: $name, description: $description, template: $template) {
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
