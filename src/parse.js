import { InvalidArgumentError } from './errors.js';

function findName(argName, config) {
  return Object.keys(config).find((key) => config[key] === argName);
}

export function parseAppArguments(args, config) {
  return args.reduce((argValues, arg) => {
    const [ argName, value ] = arg.split('=');
    const name = findName(argName.trim(), config);
    if (!name || value === undefined) {
      throw new InvalidArgumentError(argName, config);
    }
    return { ...argValues, [name]: value };
  }, {})
}

const toNoQuotes = (v) => v.replaceAll(/["']/g, '');
const toEscapeSpaces = (v) => v.replaceAll(/ /g, '\ ');

export function parseCommand(line) {
  const [_, command = '', argsStr = ''] = line.trim().match(/^([\.\w]+)([ ]+.*)*$/) || [];
  const args = argsStr.match(/[ ]*(["'])([^'"]+)\1|[^ ]+/g) || [];
  return [
    command,
    ...args
      .map((v) => v.trim())
      .map(toNoQuotes)
      .map(toEscapeSpaces),
  ];
}

export function parseErrorMessage(rawMsg) {
  let msg = rawMsg.match(/^.*:[ ]+(.*)/);
  if (!msg) {
    return rawMsg;
  }
  msg = msg[1].trim();
  return msg[0].toUpperCase() + msg.slice(1);
}
