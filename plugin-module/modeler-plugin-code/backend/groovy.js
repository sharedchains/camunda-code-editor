const execa = require('execa');
const path = require('path');

const LANGUAGE_EXECUTOR_PATH = process.env.LANGUAGE_EXECUTOR || path.resolve(__dirname, '../assets/language-executor.jar');
let groovyProcess;

module.exports = {
  startGroovyExecutor,
  stopGroovyExecutor
};

async function startGroovyExecutor() {

  try {
    const javaPath = path.resolve(__dirname, '../jvm/jdk-11.0.1+13/bin/java');
    const args = [
      '-jar',
      LANGUAGE_EXECUTOR_PATH,
      '--server.port=12421'
    ];

    groovyProcess = execa(javaPath, args);
    console.log('Started java with PID: ' + groovyProcess.pid);
    groovyProcess.stdout.pipe(process.stdout);

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