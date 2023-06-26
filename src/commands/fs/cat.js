import Command from '../command.js';
import { createReadStream } from '../utils.js';

async function cat() {
  const [ pathToFile ] = this.args;
  const readStream = await createReadStream(pathToFile);
  this.finally = () => {
    if (readStream) readStream.close();
  }
  await new Promise((resolve, reject) => {
    readStream.on('end', () => {
      this.app.output.write('\n');
      resolve([]);
    });
    readStream.on('error', reject);
    readStream.pipe(this.app.output, { end: false })
      .on('error', reject);
  });
}

export default Command.createOptions(
  'cat',
  [
    Command.createArg('pathToFile', Command.ARG_TYPE.PATH),
  ],
  'Read file and print it\'s content in console',
  cat
);
