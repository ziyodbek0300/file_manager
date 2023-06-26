import fsPromises from 'fs/promises';
import Command from '../command.js';

async function remove() {
  const [ pathToFile ] = this.args;
  await fsPromises.rm(pathToFile);
  return [`File ${pathToFile} successfully removed`];
}

export default Command.createOptions(
  'rm',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
  ],
  'Delete file',
  remove
);
