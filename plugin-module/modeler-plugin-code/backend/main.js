/**
 * @license
 * Copyright 2020 bpmn.io
 * SPDX-License-Identifier: MIT
 */
/**
 * Implemented main function to execute groovy for script evaluation
 * @author luca.bonora@sharedchains.com (Luca Bonora)
 */
module.exports = executeOnce(main, [{
  label: 'JAVA: ',
  enabled: function() {
    return false;
  },
  action: function() {
    // This is intentional
  }
}]);

async function main(app) {

  return new Promise(resolve => {
    const {
      startGroovyExecutor,
      stopGroovyExecutor
    } = require('./groovy');

    app.on('app:client-ready', async () => {
      let javaPath;
      try {
        javaPath = await startGroovyExecutor();
        console.log('[groovy-executor] started Groovy executor at ' + javaPath);
      } catch (error) {
        javaPath = error.message;
        console.error('[groovy-executor] unable to start Groovy executor', error);
        app.emit('menu:action', 'show-dialog', {
          message: 'Couldn\'t start Groovy executor: ' + error.message,
          title: 'Camunda Code Editor Error',
          type: 'error'
        });
      }

      resolve(javaPath);
    });

    app.on('quit', () => {
      console.log('[groovy-executor] stopping Groovy executor');
      return stopGroovyExecutor();
    });
  });
}

/**
 * Wrapper to make sure that wrapped function is executed only once.
 *
 * @param {function} fn
 * @param {*} returnValue
 */
function executeOnce(fn, returnValue) {
  let executed = false;
  let updatedReturnValue = returnValue;

  return function(...args) {
    if (executed) {
      return updatedReturnValue;
    }

    executed = true;
    fn(...args).then(javaPath => {
      updatedReturnValue = updateReturnValueLabel(returnValue[0], javaPath);
    });

    return updatedReturnValue;
  };
}

function updateReturnValueLabel(returnValue, arg) {
  returnValue.label = returnValue.label + arg;
  return [returnValue];
}