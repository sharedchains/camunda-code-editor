import execa from 'execa';
import path from 'path';

const GROOVY_EXECUTOR_PATH = process.env.GROOVY_EXECUTOR || path.resolve(__dirname, '../assets/groovy-executor.jar');
let groovyProcess;

export const startGroovyExecutor = async () => {
  try {
    const javaPath = path.resolve(__dirname, '../jvm/jdk-11.0.1+13/bin/java');
    const args = [
      '-jar',
      GROOVY_EXECUTOR_PATH,
      '--server.port=12421'
    ];

    groovyProcess = await execa(javaPath, args);
  } catch (error) {
    console.log(error);
    throw new Error('Cannot find java executable');
  }
};

export const stopGroovyExecutor = async () => {
  if (!groovyProcess) {
    return;
  }

  groovyProcess.kill();
};