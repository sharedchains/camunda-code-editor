/**
 * @license
 * Copyright 2020 bpmn.io
 * SPDX-License-Identifier: MIT
 */
/**
 * Implemented main function to execute groovy for script evaluation
 * @author luca.bonora@sharedchains.com (Luca Bonora)
 */
const which = require('which');
const {
  startGroovyExecutor,
  stopGroovyExecutor
} = require('./groovy');

const JAVA_HOME = process.env.JAVA_HOME;

module.exports = executeOnce(main);

async function main(app) {

  return new Promise((resolve, reject) => {

    app.on('app:client-ready', async () => {

      try {
        let javaPaths = await which('java', { all: true });
        app.emit('menu:action', 'emit-event', {
          type: 'codeEditor.config',
          payload: { java: javaPaths }
        });

        let menus = buildMenu(javaPaths, null, app);
        resolve({ javaPaths: javaPaths, ...menus });
      } catch (error) {
        reject(error);
      }

    });

    app.on('quit', () => {
      console.log('[groovy-executor] stopping Groovy executor');
      return stopGroovyExecutor();
    });
  });
}

function buildMenu(javaPaths, startedJdk, app) {
  async function handleStartExecutor(javaPath) {
    try {
      await startGroovyExecutor(javaPath);
      console.log('[groovy-executor] started Groovy executor at ' + javaPath);
    } catch (error) {
      console.error('[groovy-executor] unable to start Groovy executor', error);
      app.emit('menu:action', 'show-dialog', {
        message: 'Couldn\'t start Groovy executor: ' + error.message,
        title: 'Camunda Code Editor Error',
        type: 'error'
      });
    }
  }

  function startAction(javaPath, key) {
    handleStartExecutor(javaPath);
    app.emit('menu:action', key);
  }

  let menus = [];
  if (javaPaths) {
    javaPaths.forEach((javaPath, index) => {
      let key = 'toggleJDK_' + (index + 1);
      if (!startedJdk) {
        if (JAVA_HOME) {
          if (javaPath.startsWith(JAVA_HOME)) {
            startAction(javaPath, key);
            startedJdk = key;
          }
        } else if (index === 0) {
          startAction(javaPath, key);
          startedJdk = key;
        }
      }

      menus.push({
        label: 'Toggle JDK: ' + javaPath,
        enabled: function() {
          return startedJdk !== key;
        },
        action: function() {
          stopGroovyExecutor();
          startAction(javaPath, key);
        }
      });
    });
  }
  return { startedJdk, menus };
}

/**
 * Wrapper to make sure that wrapped function is executed only once.
 *
 * @param {function} fn
 */
function executeOnce(fn) {
  let executed = false;
  let returnValue = [];
  let javaPaths;
  let workingJdk;

  return function(...args) {
    if (executed) {
      let { menus, startedJdk } = buildMenu(javaPaths, workingJdk, ...args);
      returnValue = menus;
      workingJdk = startedJdk;
      return returnValue;
    }

    executed = true;
    fn(...args).then(result => {
      javaPaths = result.javaPaths;
      returnValue = result.menus;
      workingJdk = result.startedJdk;
    }).catch(error => {
      let app = args[0];
      app.emit('menu:action', 'show-dialog', {
        message: 'Couldn\'t start Groovy executor: ' + error,
        title: 'Camunda Code Editor Error',
        type: 'error'
      });
    });

    return returnValue;
  };
}