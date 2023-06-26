import Command from '../command.js';
import { createWriteStream } from '../utils.js';

async function add() {
  const [ pathToFile ] = this.args;
  const writeStream = await createWriteStream(pathToFile);
  this.finally = () => {
    if (writeStream) writeStream.close();
  };
  return [`File successfully added ${pathToFile}`];
}

export default Command.createOptions(
  'add',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
  ],
  'Create empty file in current working directory',
  add
);