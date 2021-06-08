import Interpreter from '../../assets/js-interpreter';
import { STOP_CODE_EDITOR } from '../EventHelper';

export default class JSExecutor {

  constructor(code, contextVariables, logger, eventBus) {
    let initFunction = function(interpreter, globalObject) {

      // Create 'console' global object
      let console = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'console', console);

      let error = function(err) {
        logger.log(err.stack);
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
      const clear = function() {
        logger.clear();
      };
      interpreter.setProperty(console, 'clear', interpreter.createNativeFunction(clear));

      contextVariables.forEach(variable => {
        let pseudo = interpreter.nativeToPseudo(variable.value);
        interpreter.setProperty(globalObject, variable.name, pseudo);
      });
    };

    this.jsInterpreter = new Interpreter(code, initFunction);
    this._logger = logger;
    this._eventBus = eventBus;
  }

  execute() {
    try {

      let stopExecution = false;
      this._eventBus.once(STOP_CODE_EDITOR, () => {
        stopExecution = true;
      });

      let nextStep = () => {
        if (this.jsInterpreter.step() && !stopExecution) {
          setTimeout(nextStep, 0);
        } else {
          stopExecution = true;
        }
      };

      // To prevent memory bombs, we stop the execution after 15 seconds
      setTimeout(() => { stopExecution = true;}, 15000);

      nextStep();
    } catch (error) {
      this._logger.log(error);
      console.error(error);
    }
  }

}