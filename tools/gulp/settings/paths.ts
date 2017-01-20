import * as fs from 'fs';
import {extname, join} from 'path';
import {PROJECT_NAME} from './constants';


export const PROJECT_ROOT = join(__dirname, '../../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');
export const DIST_COMPONENTS_ROOT = join(DIST_ROOT, PROJECT_NAME);

export const COMPONENTS_DIR = join(SOURCE_ROOT, 'lib');
export const GUIDES_DIR = join(PROJECT_ROOT, 'guides');

export const dirs = Object.freeze({
  components: COMPONENTS_DIR,

  root: PROJECT_ROOT,
  src: SOURCE_ROOT,
  dist: DIST_ROOT,

  tools: {
    dgeni: join(PROJECT_ROOT, 'tools/dgeni'),
    gulp: join(PROJECT_ROOT, 'tools/gulp'),
    lint: join(PROJECT_ROOT, 'tools/lint'),
  },
});

/**
 * If the string passed in is a glob, returns it,
 * otherwise append '**\/*' to it.
 * @param  {string}   maybeGlob [path to resolved directory]
 * @param  {string[]} ...paths  [path segments to append]
 * @return {string}             [resolved path pattern]
 */
export function resolve(maybeGlob: string, ...paths: string[]): string {
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
