import Command from '../command.js';

async function help() {
  const { commands } = this.app;
  const data = Object.keys(commands).map((key) => commands[key].getCommandInfo());
  return [undefined, data.join('\n')];
}

export const options = Command.createOptions(
  'help',
  [],
  'Print help',
  help
);