const which = require('which');
const execa = require('execa');
const path = require('path');

const LANGUAGE_EXECUTOR_PATH = process.env.LANGUAGE_EXECUTOR || path.resolve(__dirname, '../assets/language-executor.jar');
const LANGUAGE_EXECUTOR_PORT = process.env.LANGUAGE_EXECUTOR_PORT || '12421';
let groovyProcess;

module.exports = {
  startGroovyExecutor,
  stopGroovyExecutor
};

async function startGroovyExecutor() {

  try {

    const javaPath = await which('java');
    const args = [
      '-jar',
      LANGUAGE_EXECUTOR_PATH,
      `--server.port=${LANGUAGE_EXECUTOR_PORT}`
    ];

    groovyProcess = execa(javaPath, args);
    console.log('Started java with PID: ' + groovyProcess.pid);
    groovyProcess.stdout.pipe(process.stdout);
    groovyProcess.stderr.pipe(process.stderr);

    return javaPath;
  } catch (error) {
    console.log(error);
    throw new Error('Cannot find java executable');
  }
}

async function stopGroovyExecutor() {
  if (!groovyProcess) {
    console.log('No process found. Exiting...');
    return;
  }

  groovyProcess.kill();
}