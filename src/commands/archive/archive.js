import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from '../utils.js';

const archive = async (pathToFile, pathToNewDestination, command) => {
  let readStream, writeStream;
  try {
    readStream = await createReadStream(pathToFile);
    writeStream = await createWriteStream(pathToNewDestination);
    const transform = command === 'compress'
      ? createBrotliCompress()
      : createBrotliDecompress();
    await pipeline(readStream, transform, writeStream);
  } catch (err) {
    throw err;
  } finally {
    if (readStream) readStream.close();
    if (writeStream) writeStream.close();
  }
};

export default archive;
