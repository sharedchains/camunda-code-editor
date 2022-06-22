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
  stopGroovyExecutor,
  isProcessActive
} = require('./groovy');

const JAVA_HOME = process.env.JAVA_HOME;

module.exports = executeOnce(main);

async function main(jdk, app) {

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
        let menus = buildMenu(javaPaths, jdk, app);
        resolve({ javaPaths: javaPaths, ...menus });
      } catch (error) {
        reject(error);
      }

    });
  });
}

function buildMenu(javaPaths, jdk, app) {
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
      jdk.working = key;
      app.emit('menu:action', key);
    });
  }

  let menus = [];
  let startJdk = undefined;
  if (javaPaths) {
    javaPaths.forEach((javaPath, index) => {
      let key = 'toggleJDK_' + (index + 1);
      if (!jdk || !jdk.jdk) {
        if (JAVA_HOME) {
          if (javaPath.startsWith(JAVA_HOME)) {
            console.log('>>>>>>>>> JAVA_HOME Present');
            startJdk = () => startAction(javaPath, key);
          }
        } else if (index === 0) {
          console.log('>>>>>>>>> JDK found');
          startJdk = () => startAction(javaPath, key);
        }
      }

      menus.push({
        label: 'Toggle JDK: ' + javaPath,
        enabled: function() {
          return jdk.jdk !== key;
        },
        action: function() {
          stopGroovyExecutor();
          startAction(javaPath, key);
        }
      });
    });
  }
  return { menus, startJdk };
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
  let jdk = {
    jdk: null,
    set working(newJdk) {
      this.jdk = newJdk;
    }
  };

  return function(...args) {
    let app = args[0];

    if (executed) {
      let { menus, startJdk } = buildMenu(javaPaths, jdk, ...args);
      returnValue = menus;
      if (!isProcessActive() && startJdk) {
        startJdk();
      }
      return returnValue;
    }

    executed = true;
    fn(jdk, ...args).then(result => {
      javaPaths = result.javaPaths;
      returnValue = result.menus;
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