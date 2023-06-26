import fsPromises from 'fs/promises';
import { isFileExists } from '../utils.js';
import Command from '../command.js';
import { FileExistsError } from '../../errors.js';

async function rename() {
  const [ pathToFile, newFileName ] = this.args;
  if (await isFileExists(newFileName)) {
    throw new FileExistsError(newFileName);
  }
  await fsPromises.rename(pathToFile, newFileName);
  return [`File ${pathToFile} successfully renamed to ${newFileName}`];
}

export default Command.createOptions(
  'rn',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
    Command.createArg('newFileName', Command.ARG_TYPE.NAME),
  ],
  'Rename file',
  rename
);