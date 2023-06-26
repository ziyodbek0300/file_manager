import Command from '../command.js';
import archive from './archive.js';

async function compress() {
  const [ pathToFile, pathToNewDestination ] = this.args;
  try {
    await archive(pathToFile, pathToNewDestination, this.options.name);
    return [`File ${pathToFile} successfully compressed to ${pathToNewDestination}`];
  } catch (err) {
    this.onError(err);
  }
}

export default Command.createOptions(
  'compress',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
    Command.createArg('pathToNewDestination', Command.ARG_TYPE.PATH),
  ],
  'Compress file (using Brotli algorithm)',
  compress
);

