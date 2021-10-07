const which = require('which');
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

    // TODO: server port should be externalized in a variable like language_executor_path
    const javaPath = await which('java');
    const args = [
      '-jar',
      LANGUAGE_EXECUTOR_PATH,
      '--server.port=12421'
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