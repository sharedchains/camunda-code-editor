const execa = require('execa');
const path = require('path');

const LANGUAGE_EXECUTOR_PATH = process.env.LANGUAGE_EXECUTOR || path.resolve(__dirname, '../assets/language-executor.jar');
const LANGUAGE_EXECUTOR_PORT = process.env.LANGUAGE_EXECUTOR_PORT || '12421';
let groovyProcess;

module.exports = {
  startGroovyExecutor,
  stopGroovyExecutor
};

async function startGroovyExecutor(javaPath) {

  try {
    const args = [
      '-jar',
      LANGUAGE_EXECUTOR_PATH,
      `--server.port=${LANGUAGE_EXECUTOR_PORT}`
    ];

    groovyProcess = execa(javaPath, args);
    console.log('Started java with PID: ' + groovyProcess.pid);
    groovyProcess.stdout.pipe(process.stdout);
    groovyProcess.stderr.pipe(process.stderr);
  } catch (error) {
    console.log(error);
    throw new Error('Cannot find java executable');
  }
}

function stopGroovyExecutor() {
  if (!groovyProcess) {
    console.log('No process found. Exiting...');
    return;
  }

  groovyProcess.kill();
}