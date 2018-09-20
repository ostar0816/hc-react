import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import DicomTagsToImport from '../constants/dicomTagsToImport';
import DicomNameToTag from '../constants/dicomNameToTag';

async function getDicomTags(filePath) {
  console.log(filePath);
  const { stdout: dcmTagsJsonString } = await exec(`dcm2json "${filePath}"`);
  const dcmTags = JSON.parse(dcmTagsJsonString);

  const importedDicomTags = {};
  for (let i = 0; i < DicomTagsToImport.length; ++i) {
    const tagToImport = DicomNameToTag[DicomTagsToImport[i]];

    const dcmTag = dcmTags[tagToImport];
    const value = dcmTag && dcmTag.Value && dcmTag.Value[0];
    if (value) {
      importedDicomTags[DicomTagsToImport[i]] = dcmTag.vr === 'PN' ? value.Alphabetic : value;
    }
  }

  return importedDicomTags;
}

export { getDicomTags };
