import { makeExecutableSchema } from 'apollo-server';
import { typeDefs, resolvers } from '../graphql/schema';
import fs from 'fs';
import { generateTypeScriptTypes } from 'graphql-schema-typescript';
import { connectDb } from '../mongodb';

const schema = makeExecutableSchema({ typeDefs, resolvers });
async function generate() {
  await connectDb();

  const path = `${__dirname}/../graphql/types.ts`;
  generateTypeScriptTypes(schema, path, {
    customScalarType: { ObjectId: 'ObjectId' },
    // smartTParent: true,
    // smartTResult: true,
    // asyncResult: true,
    contextType: 'GQLContext',
  })
    .then(() => {
      fs.appendFileSync(
        path,
        `
          import { ObjectId } from 'mongodb';
          import { GQLContext } from '../utils/getGraphqlContext';
    `,
      );
      console.log('DONE');
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

generate();
