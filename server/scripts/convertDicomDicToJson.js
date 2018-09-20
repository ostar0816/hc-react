const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

const dicomDicString = fs.readFileSync(`${__dirname}/../constants/dicom.dic`, 'utf8');
const dicomDicLines = dicomDicString.split('\n');

const tagToName = {};
const nameToTag = {};
const regex = /^\(([^,]*),([^\)]*)\)\t[^\t]*\t([^\t]*).*/;
dicomDicLines.forEach(line => {
  const result = regex.exec(line);
  if (result) {
    const name = result[3].startsWith('RETIRED_') ? result[3].substring(8) : result[3];
    const tag = `${result[1]}${result[2]}`;
    tagToName[tag] = name;
    nameToTag[name] = tag;
  }
});

fs.writeFileSync(`${__dirname}/../constants/dicomTagToName.json`, JSON.stringify(tagToName, null, 2), 'utf8');
fs.writeFileSync(`${__dirname}/../constants/dicomNameToTag.json`, JSON.stringify(nameToTag, null, 2), 'utf8');
