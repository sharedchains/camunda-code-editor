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

import {
  startGroovyExecutor,
  stopGroovyExecutor
} from './groovy';

async function main(app) {

  try {
    await startGroovyExecutor();
    console.log('[groovy-executor] started Groovy executor');
  } catch (error) {
    console.error('[groovy-executor] unable to start Groovy executor', error);
    return;
  }

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