import { copyFile } from '../utils.js';
import Command from '../command.js';

async function copy() {
  const [ pathToFile, pathToNewDirectory ] = this.args;
  await copyFile(pathToFile, pathToNewDirectory);
  return [`File '${pathToFile}' successfully copied to '${pathToNewDirectory}'`];
}

export default Command.createOptions(
  'cp',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
    Command.createArg('pathToNewDirectory', Command.ARG_TYPE.DIR_PATH),
  ],
  'Copy file',
  copy
);
