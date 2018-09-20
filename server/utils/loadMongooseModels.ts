import { join } from 'path';
import fs from 'fs';

export default function loadMongooseModels() {
  const modelArray = join(__dirname, '..', 'models');
  fs.readdirSync(modelArray)
    .filter(file => ~file.indexOf('.ts'))
    .forEach(file => require(join(modelArray, file)));
}
