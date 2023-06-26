
class CustomError extends Error {
  constructor(msg, name) {
    super(msg);
    this.name = name || this.constructor.name;
  }
}

class OperationFailedError extends CustomError {
  constructor(operation, reason) {
    super(`Operation failed: ${operation}. Reason: ${reason}`);
    this.operation = operation;
    this.reason = reason;
  }
}

class InvalidInputError extends CustomError {
  constructor(command, args = []) {
    super(`Invalid input: '${command}${args.length === 0 ? '' : ` ${args.join(' ')}`}'`);
    this.command = command;
  }
}

class InvalidNumberOfArguments extends CustomError {
  constructor(command) {
    super(`Invalid number of arguments`);
    this.command = command;
  }
}

class InvalidArgumentError extends CustomError {
  constructor(arg, config) {
    const argsOutput = Object.values(config).map((argName) => `${argName}=<value>`)
    super(`Invalid argument: '${arg}': supported arguments list: ${argsOutput}`);
    this.arg = arg;
  }
}

class InvalidKeyError extends CustomError {
  constructor(key) {
    super(`Invalid key '${key}'`);
    this.key = key;
  }
}

class FileExistsError extends CustomError {
  constructor(pathToFile) {
    super(`File already exists '${pathToFile}'`);
    this.pathToFile = pathToFile;
  }
}

class SourceIsDirectoryError extends CustomError {
  constructor(source, isDirectory = true) {
    super(`Source '${source}' is${!isDirectory ? ' not ' : ' '}a directory!`);
    this.source = source;
  }
}

const isCustomError = (err) => {
  return err instanceof CustomError;
}

export {
  OperationFailedError,
  InvalidInputError,
  InvalidNumberOfArguments,
  InvalidArgumentError,
  InvalidKeyError,
  isCustomError,
  FileExistsError,
  SourceIsDirectoryError,
};
