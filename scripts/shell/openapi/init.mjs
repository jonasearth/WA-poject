import fs from 'fs';
import env from './env.mjs';
import command from '../command.mjs';

// Create Dirs
fs.mkdirSync(env.RELEASE_DIR);
/**
 * Login to azure cli using the service principal specified
 */
command(
  `az login --service-principal -u ${env.AZ_CLIENT_ID} -p ${env.AZ_CLIENT_SECRET} --tenant ${env.AZ_TENANT}`,
  { log: false },
);
command(`az account set --subscription=${env.AZ_SUBSCRIPTION}`);

process.exit(0);
