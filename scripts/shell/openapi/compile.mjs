import { join } from 'path';
import command from '../command.mjs';
import env from './env.mjs';

const spec = env.OPENAPI_FILE_PATH;
const bundle = join(env.RELEASE_DIR, env.OPENAPI_RELEASE_FILE);

/**
 * Resolve api refs, convert file to json and validate it
 */
command(`swagger-cli bundle -o ${bundle} ${spec} -r`);
command(`swagger-cli validate ${bundle}`);

process.exit(0);
