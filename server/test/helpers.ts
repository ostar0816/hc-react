import { typeDefs, resolvers } from '../graphql/schema';

import { connectDb, disconnectDb, getDb } from '../mongodb';
import { makeExecutableSchema } from 'apollo-server';

export async function connectMongo() {
  return connectDb(global.__MONGO_URI__, {});
}

export async function clearDatabase() {
  await getDb().dropDatabase();
}

export async function disconnectMongo() {
  // await mongoose.connection.close();
  return disconnectDb();
}

export const schema = makeExecutableSchema({ typeDefs, resolvers });
