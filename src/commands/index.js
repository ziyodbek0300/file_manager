import myFs from './fs/index.js';
import nwd from './nwd/index.js';
import archive from './archive/index.js';
import rest from './rest/index.js';

const commands = {
  myFs, nwd, archive, rest,
};

const getCommands = (cmds) => {
  if (cmds.handler !== undefined) {
    return [ cmds ];
  }
  return Object.keys(cmds).reduce((acc, key) => {
    return [ ...acc, ...getCommands(cmds[key]) ];
  }, []);
}

export default getCommands(commands);
