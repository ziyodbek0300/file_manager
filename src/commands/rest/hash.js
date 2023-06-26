import crypto from 'crypto';
import Command from '../command.js';
import { createReadStream } from '../utils.js';

async function hash() {
  const [ pathToFile ] = this.args;

  const hash = crypto.createHash('sha256');
  hash.setEncoding('hex');
  const readStream = await createReadStream(pathToFile);
  return await new Promise((resolve, reject) => {
    readStream.on('error', (err) => reject(err));
    readStream.on('end', () => {
      hash.end();
      resolve([`Hash of '${pathToFile}' is:`, hash.read()]);
    })
    readStream.pipe(hash).on('error', (err) => reject(err))
  })
}

export default Command.createOptions(
  'hash',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
  ],
  'Calculate hash for file and print it into console',
  hash
);
