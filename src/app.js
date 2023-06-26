import readline from 'readline';
import os from 'os';
import EventEmmiter from 'events';
import { InvalidInputError, InvalidArgumentError, isCustomError } from './errors.js';
import { parseAppArguments, parseCommand } from './parse.js';
import { msg } from './appearance.js';
import commandsInfo from './commands/index.js';
import Command from './commands/command.js';

export default class App extends EventEmmiter {
  constructor(args) {
    super();
    this.output = process.stdout;
    this._initEvents();
    this._initReadline();
    this._initCommands();
    this._initUserInfo(args);
  }

  _initUserInfo = (args) => {
    try {
      const argValues = parseAppArguments(args, {
        userName: '--username'
      });
      const userInfo = os.userInfo();
      this.userName = argValues.userName || userInfo.username;
      this.workingDirectory = userInfo.homedir;
  
      this.emit(App.EVENTS.START);
    } catch (err) {
      this.emit(App.EVENTS.ERROR, err);
    }
  }

  _writePromt = ({ message, data } = {}) => {
    const { DIRECTORY, LINE_START } = App.MESSAGES;
    const dirMessage = DIRECTORY(this.workingDirectory);
    const outputData = !data ? '' : `${data}\n`;
    const outputMessage = !message ? '' : `${message}\n`;
    this.output.write(`${outputMessage}${outputData}${msg.greet(dirMessage)}\n${msg.greet(LINE_START)}`);
  }

  _initEvents() {
    this.on(App.EVENTS.START, this.onStart);
    this.on(App.EVENTS.CLOSE, this.onClose);
    this.on(App.EVENTS.COMMAND, this.onCommand);
    this.on(App.EVENTS.ERROR, this.onError);
  }

  onStart = () => {
    this.output.write(App.MESSAGES.WELCOME(this.userName));
    this._writePromt();
  }

  onClose = () => {
    this.output.write(App.MESSAGES.FAREWELL(this.userName));
    this.readline.close();
    process.exitCode = 0;
  }
  
  onCommand = async (line) => {
    const [ command, ...args ] = parseCommand(line);
    try {
      const commandResult = await this._processCommand(command, args);
      if (commandResult.showPromtOnSuccess) {
        this._writePromt(commandResult);
      }
    } catch (err) {
      this.emit(App.EVENTS.ERROR, err);
    }
  }

  async _processCommand(command, args) {
    const cmd = this.commands[command];
    if (cmd === undefined) {
      throw new InvalidInputError(command, args);
    }
    return await cmd.run(args);
  }
  
  onError = (err) => {
    const isErrorCustom = isCustomError(err);
    if (!isErrorCustom || err instanceof InvalidArgumentError) {
      console.error(msg.error(err.message));
      return this.emit(App.EVENTS.CLOSE);
    }
    this._writePromt({ message: msg.error(err.message)} );
  }
  
  _initReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: this.output,
    });
    this.readline.on('line', (line) => this.emit(App.EVENTS.COMMAND, line.trim()));
    this.readline.on('SIGINT', () => this.emit(App.EVENTS.CLOSE));
  }

  _initCommands() {
    this.commands = commandsInfo.reduce((acc, cmdInfo) => {
      return { ...acc, [cmdInfo.name]: new Command(cmdInfo, this)}
    }, {});
  }
}

App.EVENTS = {
  START: 'start',
  CLOSE: 'close',
  COMMAND: 'command',
  ERROR: 'error',
};

App.MESSAGES = {
  LINE_START: '> ',
  WELCOME: (username) => msg.greet(`*** Welcome to the File Manager, ${username}! Enter 'help' to list available commands. ***\n`),
  FAREWELL: (username = 'unknown') => msg.greet(`\nThank you for using File Manager, ${username}, goodbye!\n`),
  DIRECTORY: (dir) => `You are currently in ${msg.dir(dir)}`,
};
