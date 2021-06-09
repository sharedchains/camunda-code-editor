/**
 * @license
 * Copyright 2020 bpmn.io
 * SPDX-License-Identifier: MIT
 */
/**
 * Implemented main function to execute groovy for script evaluation
 * @author luca.bonora@sharedchains.com (Luca Bonora)
 */
module.exports = executeOnce(main, []);

async function main(app) {

  const {
    startGroovyExecutor,
    stopGroovyExecutor
  } = require('./groovy');
  app.on('app:client-ready', async () => {
    try {
      await startGroovyExecutor();
      console.log('[groovy-executor] started Groovy executor');
    } catch (error) {
      console.error('[groovy-executor] unable to start Groovy executor', error);

    }
  });

  app.on('quit', () => {
    console.log('[groovy-executor] stopping Groovy executor');
    return stopGroovyExecutor();
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

  return function(...args) {
    if (executed) {
      return returnValue;
    }

    executed = true;
    fn(...args);

    return returnValue;
  };
}