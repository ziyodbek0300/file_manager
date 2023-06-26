import Command from '../command.js';
import archive from './archive.js';

async function decompress() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    await archive(pathToFile, pathToNewDestination, this.options.name);
    return [`File ${pathToFile} successfully decompressed to ${pathToNewDestination}`];
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'decompress',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
    Command.createArg('pathToNewDestination', Command.ARG_TYPE.PATH),
  ],
  'Decompress file (using Brotli algorithm)',
  decompress
);
