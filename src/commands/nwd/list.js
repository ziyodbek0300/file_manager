import fsPromises from 'fs/promises';
import Command from '../command.js';

const opt = {
  withFileTypes: true
}

const types = {
  1: "file",
  2: "directory",
};

async function list() {
  const [pathToDirectory] = this.args;

  const files = await fsPromises.readdir(pathToDirectory, opt);

  const dataForTable = files.map((file) => {
    const type = file[Object.getOwnPropertySymbols(file)[0]];
    return {
      Name: file.name,
      Type: types[type] || "-"
    }
  }).sort((a, b) => a.Name.localeCompare(b.Name));

  return [undefined, console.table(dataForTable.sort((a, b) => a.Type.localeCompare(b.Type)))];
}

export default Command.createOptions(
  'ls',
  [
    Command.createArg('pathToDirectory', Command.ARG_TYPE.PATH, false),
  ],
  'List all files and folder in current directory and print it to console',
  list
);
