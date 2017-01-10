import * as fs from 'fs';
import {extname, join} from 'path';


export const PROJECT_ROOT = join(__dirname, '../../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');
export const DIST_COMPONENTS_ROOT = join(DIST_ROOT, '@mwt/ui');

export const COMPONENTS_DIR = join(SOURCE_ROOT, 'lib');


export const dirs = Object.freeze({
  components: COMPONENTS_DIR,

  root: PROJECT_ROOT,
  src: SOURCE_ROOT,
  dist: DIST_ROOT,

  tools: {
    gulp: join(PROJECT_ROOT, 'tools/gulp'),
    lint: join(PROJECT_ROOT, 'tools/lint'),
  },
});

/** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
export function resolve(maybeGlob: string, ...paths: string[]) {
  if (maybeGlob.indexOf('*') != -1) {
    return maybeGlob;
  }
  try {
    const stat = fs.statSync(maybeGlob);
    if (stat.isFile()) {
      return maybeGlob;
    }
  } catch (e) {}


  if (paths.length === 0) {
    paths.push('**/*');
  }

  return join(maybeGlob, ...paths);
}
