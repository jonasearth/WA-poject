import * as path from 'path';
import command from '../command.mjs';
import env from './env.mjs';

const bundle = path.join(env.RELEASE_DIR, env.OPENAPI_RELEASE_FILE);

/**
 * Import the definition to APIM
 */
const importArgs = [
  `--path=${env.APIM_PATH}`,
  `--api-id=${env.APIM_API_ID}`,
  `--resource-group=${env.APIM_RESOURCE_GROUP}`,
  `--service-name=${env.APIM_ID}`,
  '--protocols=https',
  `--service-url=${env.APIM_SERVICE_URL}`,
  '--api-type=http',
  '--specification-format=OpenApiJson',
  `--specification-path=${bundle}`,
  `--subscription-required=${env.APIM_SUBSCRIPTION_REQUIRED}`,
  `--subscription-key-query-param-name=${env.APIM_SUBSCRIPTION_KEY_QUERY_PARAM_NAME}`,
  `--subscription-key-header-name=${env.APIM_SUBSCRIPTION_KEY_HEADER_NAME}`,
].join(' ');
command(`az apim api import ${importArgs}`);

/**
 * Create a revision using the commit hash
 */
const revisionArgs = [
  `--api-id=${env.APIM_API_ID}`,
  `--resource-group=${env.APIM_RESOURCE_GROUP}`,
  `--service-name=${env.APIM_ID}`,
  `--api-revision=${env.COMMIT_SHORT_SHA}`,
  `--api-revision-description="Revision ${env.COMMIT_SHORT_SHA} from user ${env.USER_EMAIL}"`,
].join(' ');
command(`az apim api revision create ${revisionArgs}`);

/**
 * Release the new API revision
 */
const releaseArgs = [
  `--api-id=${env.APIM_API_ID}`,
  `--resource-group=${env.APIM_RESOURCE_GROUP}`,
  `--service-name=${env.APIM_ID}`,
  `--api-revision=${env.COMMIT_SHORT_SHA}`,
].join(' ');
command(`az apim api release create ${releaseArgs}`);

process.exit(0);
