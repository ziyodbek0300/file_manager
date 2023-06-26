import path from 'path';
import {
  InvalidInputError,
  OperationFailedError,
  InvalidKeyError,
  isCustomError,
  InvalidNumberOfArguments
} from '../errors.js';
import { msg } from '../appearance.js';
import { toSnakeCase } from './utils.js';
import { parseErrorMessage } from '../parse.js';

export default class Command {
  constructor(options, app) {
    this.options = options;
    this.showPromtOnSuccess = true;
    this.app = app;
    this.requiredArgsNumber = {
      min: this.options.argsConfig.reduce((acc, arg) => acc + arg.required, 0),
      max: this.options.argsConfig.length,
    };
  }

  async run(args = []) {
    try {
      this.args = args;
      this.checkArgs();
      return this.onSuccess(await this.options.handler.call(this));
    } catch (error) {
      this.onError(error);
    } finally {
      if (this.finally) this.finally.call(null);
    }
  }

  onSuccess([message, data] = []) {
    const outputMessage = message && msg.service(message);
    return { message: outputMessage, data, showPromtOnSuccess: this.showPromtOnSuccess };
  }

  onError(err) {
    if (err instanceof InvalidInputError
      || err instanceof InvalidKeyError
      || err instanceof InvalidNumberOfArguments) {
      this.app.output.write(`${this.getCommandInfo()}\n`);
    }
    throw new OperationFailedError(this.options.name, isCustomError(err) ? err.message : parseErrorMessage(err.message));
  }

  checkArgs() {
    const {
      args: { length },
      options: { argsConfig, name },
      requiredArgsNumber: { min, max },
    } = this;
    const isArgsNumberValid = length >= min && length <= max;
    if (!isArgsNumberValid) {
      throw new InvalidNumberOfArguments(name);
    }
    this.args = argsConfig.map(this.processArg);
    return true;
  }

  processArg = (arg, i) => {
    const argValue = this.args[i];
    const prevArgValue = this.args[i - 1];
    const T = Command.ARG_TYPE;
    switch(arg.type) {
      case T.PATH: return this.processPath(argValue);
      case T.DIR_PATH: return this.processDirPath(argValue, prevArgValue);
      case T.NAME: return this.processName(argValue, prevArgValue);
      case T.KEY: return this.processKey(argValue);
      default: return argValue;
    }
  }

  processKey(value) {
    if (!this.options.keys.includes(value)) {
      throw new InvalidKeyError(value);
    }
    return value;
  }

  processPath(value) {
    const { app: { workingDirectory } } = this;
    return value !== undefined
      ? path.resolve(workingDirectory, value)
      : workingDirectory;
  }

  processDirPath(value, prevValue) {
    const { base } = path.parse(prevValue);
    return path.resolve(this.app.workingDirectory, value, base); 
  }

  processName(value, prevValue) {
    const resolvedFilePath = path.resolve(this.app.workingDirectory, prevValue);
    return path.resolve(path.parse(resolvedFilePath).dir, value);
  }

  getCommandInfo = () => {
    const { name, argsConfig, description } = this.options;
    const nameOutput = msg.dir(`${name} `);
    const argsOutput = argsConfig.length !== 0
      ? msg.hl(argsConfig.map(({ name }) => `<${toSnakeCase(name)}> `).join(''))
      : '';
    return `${nameOutput}${argsOutput}${description}`;
  }
  
}

Command.createOptions = function(name, argsConfig, description, handler, keys = []) {
  return {
    name, argsConfig, description, handler, keys,
  }
}

Command.createArg = function(name, type, required = true) {
  return {
    name, type, required,
  }
}

Command.ARG_TYPE = {
  PATH: 'path',
  DIR_PATH: 'dirPath',
  KEY: 'key',
  NAME: 'name',
};
