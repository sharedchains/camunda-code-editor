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
    app.on('quit', () => {
      console.log('[groovy-executor] stopping Groovy executor');
      return stopGroovyExecutor();
    });

    app.on('app:client-ready', async () => {
      try {
        let javaPaths = await which('java', { all: true });
        app.emit('menu:action', 'emit-event', {
          type: 'codeEditor.config',
          payload: { java: javaPaths }
        });
        let menus = buildMenu(javaPaths, null, (_jdk) => {}, app);
        resolve({ javaPaths: javaPaths, ...menus });
      } catch (error) {
        reject(error);
      }

    });
  });
}

function buildMenu(javaPaths, workingJdk, updateJdk, app) {
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
    handleStartExecutor(javaPath).then(() => {
      app.emit('menu:action', key);
    });
  }

  let menus = [];
  if (javaPaths) {
    javaPaths.forEach((javaPath, index) => {
      let key = 'toggleJDK_' + (index + 1);
      if (!workingJdk) {
        if (JAVA_HOME) {
          if (javaPath.startsWith(JAVA_HOME)) {
            startAction(javaPath, key);
            workingJdk = key;
          }
        } else if (index === 0) {
          startAction(javaPath, key);
          workingJdk = key;
        }
      }

      menus.push({
        label: 'Toggle JDK: ' + javaPath,
        enabled: function() {
          return workingJdk !== key;
        },
        action: function() {
          stopGroovyExecutor();
          updateJdk(key);
          startAction(javaPath, key);
        }
      });
    });
  }
  return { startedJdk: workingJdk, menus };
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

  const updateWorkingJdk = (newJdk) => {
    workingJdk = newJdk;
  };

  return function(...args) {
    console.log('ENTERED executeOnce(main)');
    let app = args[0];

    if (executed) {
      let { menus } = buildMenu(javaPaths, workingJdk, updateWorkingJdk, ...args);
      returnValue = menus;
      return returnValue;
    }

    executed = true;
    fn(...args).then(result => {
      javaPaths = result.javaPaths;
      returnValue = result.menus;
      workingJdk = result.startedJdk;
    }).catch(error => {

      app.emit('menu:action', 'show-dialog', {
        message: 'Couldn\'t start Groovy executor: ' + error,
        title: 'Camunda Code Editor Error',
        type: 'error'
      });
    });

    return returnValue;
  };
}