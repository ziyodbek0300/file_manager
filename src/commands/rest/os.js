import osNode from 'os';
import Command from '../command.js';
import { msg } from '../../appearance.js';

const getCpusInfo = () => {
  const cpus = osNode.cpus();
  const results = cpus.map(({ model, speed}, index) => {
    return `#${index + 1} ${msg.hl('Model:')} ${model}; ${msg.hl('Speed:')} ${speed / 1000}GHz`;
  });
  return `Overall amount: ${results.length}: \n${results.join('\n')}`;
};

const createKey = (description, handler) => {
  return { description, handler };
};

const keys = {
  ['--EOL']: createKey(
    'Get EOL (default system End-Of-Line)',
    () => osNode.EOL === '\n' ? '\\n' : '\\r\\n',
  ),
  ['--cpus']: createKey(
    'Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)',
    getCpusInfo,
  ),
  ['--homedir']: createKey(
    'Get home directory',
    () => osNode.userInfo().homedir,
  ),
  ['--username']: createKey(
    'Get current system user name (Do not confuse with the username that is set when the application starts)',
    () => osNode.userInfo().username,
  ),
  '--architecture': createKey(
    'Get CPU architecture for which Node.js binary has compiled',
    () => osNode.arch(),
  ),
};

async function os() {
  const [ key ] = this.args;
  const data = await keys[key].handler.call(null);
  return [undefined, data];
}

const printKeys = () => {
  return Object.keys(keys)
    .map((key) => `  ${msg.hl(key)} - ${keys[key].description}`)
    .join('\n');
};

export default Command.createOptions(
  'os',
  [
    Command.createArg('key', Command.ARG_TYPE.KEY),
  ],
  `Operating system info (prints following information in console)\n${printKeys()}`,
  os,
  Object.keys(keys),
);
