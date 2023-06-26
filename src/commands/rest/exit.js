import Command from '../command.js';
import App from '../../app.js';

async function exit() {
  this.app.emit(App.EVENTS.CLOSE);
  this.showPromtOnSuccess = false;
  return ['Exiting...'];
}

export default Command.createOptions(
  '.exit',
  [],
  'Exit programm',
  exit
);