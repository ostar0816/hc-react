import { MongoClient, MongoClientOptions, Db, ObjectId } from 'mongodb';
import config from 'config';

let db: Db = null;
let client: MongoClient = null;

export { ObjectId } from 'mongodb';

export async function connectDb(
  uri = config.get<string>('mongodb.uri'),
  options = config.get<MongoClientOptions>('mongodb.options'),
) {
  if (!db) {
    client = await MongoClient.connect(
      uri,
      options,
    );

    db = client.db('pacs_ris');
  }
}

export async function disconnectDb() {
  client.close();
}

export function getDb() {
  return db;
}
