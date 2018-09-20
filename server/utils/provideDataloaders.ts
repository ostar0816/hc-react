import DataLoader from 'dataloader';
import { getDb } from '../mongodb';
import { MUser } from '../models/user';
import { MUserRole } from '../models/userRole';
import { MFacility } from '../models/facility';
import { MReferringPhysician } from '../models/referringPhysician';
import { MStudyDescription } from '../models/studyDescription';

import { ObjectId } from 'mongodb';

export function assignResultsToKeysMany(keys, dbResult, matchKey = '_id') {
  const map = {};
  for (let i = 0; i < dbResult.length; i++) {
    if (!map[dbResult[i][matchKey].toString()]) {
      map[dbResult[i][matchKey].toString()] = [];
    }
    map[dbResult[i][matchKey].toString()].push(dbResult[i]);
  }

  const result = [];
  for (let i = 0; i < keys.length; i++) {
    result.push(map[keys[i]] || []);
  }

  return result;
}

async function batchModel(collectionName, keys) {
  const dbResult = await getDb()
    .collection(collectionName)
    .find({ _id: { $in: keys } })
    .toArray();

  const map = {};
  for (let i = 0; i < dbResult.length; i++) {
    map[dbResult[i]._id.toString()] = dbResult[i];
  }

  const result = [];
  for (let i = 0; i < keys.length; i++) {
    result.push(map[keys[i]] || null);
  }

  return result;
}

function provideDataloader<TModel>(modelName) {
  return new DataLoader<ObjectId, TModel>(keys => batchModel(modelName, keys), {
    cacheKeyFn: key => key.toString(),
  });
}

function provideDataloaders() {
  return {
    User: provideDataloader<MUser>('user'),
    UserRole: provideDataloader<MUserRole>('userRole'),
    Facility: provideDataloader<MFacility>('facility'),
    ReferringPhysician: provideDataloader<MReferringPhysician>('referringPhysician'),
    StudyDescription: provideDataloader<MStudyDescription>('studyDescription'),
  };
}

export default provideDataloaders;
