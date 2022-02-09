/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import childProcess from 'child_process';

const command = (script, args = {}, environment = {}) => {
  const config = {
    log: true,
    cwd: process.cwd(),
    ...args,
  };

  const options = {
    stdio: config.log ? 'inherit' : 'ignore',
    env: {
      ...process.env,
      ...environment,
    },
  };

  if (config.log) {
    // eslint-disable-next-line no-console
    console.info(script);
  }
  try {
    return childProcess.execSync(script, {
      ...options,
      cwd: config.cwd,
    });
  } catch (error) {
    if (config.log) {
      throw error;
    }

    throw new Error('Error executing shell command');
  }
};

export default command;
