import Interpreter from '../assets/js-interpreter';
import { STOP_CODE_EDITOR } from './EventHelper';

export default function executeCode(code, logger, eventBus) {

  let initFunction = function(interpreter, globalObject) {

    // Create 'console' global object
    var console = interpreter.nativeToPseudo({});
    interpreter.setProperty(globalObject, 'console', console);

    let error = function(error) {
      logger.log(error.stack);
    };
    interpreter.setProperty(console, 'error', interpreter.createNativeFunction(error));
    const log = function(...args) {
      args.forEach(logger.log);
    };
    interpreter.setProperty(console, 'log', interpreter.createNativeFunction(log));
    const warn = function(...args) {
      args.forEach(logger.log);
    };
    interpreter.setProperty(console, 'warn', interpreter.createNativeFunction(warn));
    const info = function(...args) {
      args.forEach(logger.log);
    };
    interpreter.setProperty(console, 'info', interpreter.createNativeFunction(info));
    const clear = function(...args) {
      logger.clear();
    };
    interpreter.setProperty(console, 'clear', interpreter.createNativeFunction(clear));
  };

  try {
    const jsInterpreter = new Interpreter(code, initFunction);
    let stopExecution = false;
    eventBus.on(STOP_CODE_EDITOR, () => {
      stopExecution = true;
    });

    let nextStep = () => {
      if (jsInterpreter.step() && !stopExecution) {
        setTimeout(nextStep, 0);
      } else {
        stopExecution = true;
      }
    };

    // To prevent memory bombs, we stop the execution after 15 seconds
    setTimeout(() => { stopExecution = true;}, 15000);

    nextStep();
  } catch (error) {
    logger.log(error);
    console.error(error);
  }

}

