import fsPromises from 'fs/promises';
import fs from 'fs';
import Command from '../command.js';
import { isDirectory } from '../utils.js';
import { SourceIsDirectoryError } from '../../errors.js';

async function cd() {
  const [ pathToDirectory ] = this.args;
  await fsPromises.access(pathToDirectory, fs.constants.F_OK);
  if (!(await isDirectory(pathToDirectory))) {
    throw new SourceIsDirectoryError(pathToDirectory, false);
  }
  this.app.workingDirectory = pathToDirectory;
  return [`Working directory changed to ${pathToDirectory}`];
}

export default Command.createOptions(
  'cd',
  [
    Command.createArg('pathToDirectory', Command.ARG_TYPE.PATH),
  ],
  'Go to dedicated folder from current directory (path_to_directory can be relative or absolute)',
  cd
);
