import fs from 'fs';
import path from 'path';
import env from './env.mjs';

const bundle = path.join(env.RELEASE_DIR, env.OPENAPI_RELEASE_FILE);
const name = path.basename(bundle);
const raw = fs.readFileSync(bundle);

// Convert special characters to unicode
const data = `${raw}`
  .replace(
    /[\u0080-\uFFFF]/g,
    (match) => `\\u${`0000${match.charCodeAt(0).toString(16)}`.slice(-4)}`,
  )
  .replace(/\$\{APIM_API_DISPLAY_NAME\}/g, env.APIM_API_DISPLAY_NAME);

fs.writeFileSync(path.join(env.RELEASE_DIR, name), data);

process.exit(0);
