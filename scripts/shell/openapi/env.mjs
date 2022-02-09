import path from 'path';

/**
 * Environment vars that MUST be passed from the pipeline
 * The app registration/service principal needs at least contributor access on the APIM instance
 * The API must be created manually before running the script
 */
const env = {
  /** App registration/service principal client id */
  AZ_CLIENT_ID: process.env.AZ_CLIENT_ID || '',
  /** App registration/service principal client secret */
  AZ_CLIENT_SECRET: process.env.AZ_CLIENT_SECRET || '',
  /** App registration/service principal tenant */
  AZ_TENANT: process.env.AZ_TENANT || '',
  /** The subscription where the APIM is located */
  AZ_SUBSCRIPTION: process.env.AZ_SUBSCRIPTION || '',
  /** The APIM resource group */
  APIM_RESOURCE_GROUP: process.env.APIM_RESOURCE_GROUP || '',
  /** Path of the service on the APIM */
  APIM_PATH: process.env.APIM_PATH || '',
  /** Name of the APIM instance */
  APIM_ID: process.env.APIM_ID || '',
  /** Name of the API you wish to update. (not the display name) */
  APIM_API_ID: process.env.APIM_API_ID || '',
  /** Full url to the backend the APIM will forward requests to */
  APIM_SERVICE_URL: process.env.APIM_SERVICE_URL || '',
  APIM_API_DISPLAY_NAME: process.env.APIM_API_DISPLAY_NAME || '',
  /** Indicates if the subscription key be included in every request */
  APIM_SUBSCRIPTION_REQUIRED:
    (process.env.APIM_SUBSCRIPTION_REQUIRED || 'false') === 'true',
  /** Subscription key header name */
  APIM_SUBSCRIPTION_KEY_HEADER_NAME:
    process.env.APIM_SUBSCRIPTION_KEY_HEADER_NAME ||
    'Ocp-Apim-Subscription-Key',
  /** Subscription query parameter header name */
  APIM_SUBSCRIPTION_KEY_QUERY_PARAM_NAME:
    process.env.APIM_SUBSCRIPTION_KEY_QUERY_PARAM_NAME || 'subscription-key',
  /** Path to the openapi specification file. If using refs, path to the main openapi file */
  OPENAPI_FILE_PATH: process.env.OPENAPI_FILE_PATH || '',

  /** The variables bellow are set by azure pipelines, you do not need to pass them */
  PROJECT_DIR: process.env.SYSTEM_DEFAULTWORKINGDIRECTORY || '',
  BUILD_REPOSITORY_NAME: process.env.BUILD_REPOSITORY_NAME || '',
  BUILD_SOURCEVERSION: process.env.BUILD_SOURCEVERSION || '',
  USER_EMAIL: process.env.BUILD_REQUESTEDFOREMAIL || '',
};

/**
 * Values that are either static or result of further processing env vars
 */
const OPENAPI_RELEASE_FILE = 'bundle.json';
const RELEASE_DIR = path.join(env.PROJECT_DIR, 'release');
const PROJECT_NAME = process.env.BUILD_REPOSITORY_NAME ?? '';
const COMMIT_SHORT_SHA = (process.env.BUILD_SOURCEVERSION ?? '').substring(
  0,
  8,
);

export default Object.freeze({
  ...env,
  RELEASE_DIR,
  PROJECT_NAME,
  COMMIT_SHORT_SHA,
  OPENAPI_RELEASE_FILE,
});
