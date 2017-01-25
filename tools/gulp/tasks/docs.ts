import * as gulp from 'gulp';
import {task} from 'gulp';
import * as path from 'path';

import {COMPONENTS_DIR, DIST_ROOT, GUIDES_DIR, resolve} from '../settings/paths';

// No typings for these.
const hljs = require('highlight.js');
const markdown = require('gulp-markdown');
const transform = require('gulp-transform');


// Our docs contain comments of the form `<!-- example(...) -->` which serve as placeholders where
// example code should be inserted. We replace these comments with divs that have a
// `project-docs-example` attribute which can be used to locate the divs and initialize the example
// viewer.
const EXAMPLE_PATTERN = /<!--\W*example\(([^)]+)\)\W*-->/g;


task('docs', () => {
  return gulp.src([resolve(COMPONENTS_DIR, '**/*.md'), resolve(GUIDES_DIR, '*.md')])
      .pipe(markdown({
        // Add syntax highlight using highlight.js
        highlight: (code: string, language: string) => {
          if (language) {
            // highlight.js expects "typescript" written out, while Github supports "ts".
            let lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
            return hljs.highlight(lang, code).value;
          }

          return code;
        }
      }))
      .pipe(transform((content: string) =>
          content.toString().replace(EXAMPLE_PATTERN, (match: string, name: string) =>
              `<div project-docs-example="${name}"></div>`)))
      .pipe(gulp.dest(resolve(DIST_ROOT, '/docs')));
});

task('api', () => {
  const Dgeni = require('dgeni');
  const docsPackage = require(path.resolve(__dirname, '../../dgeni'));
  const dgeni = new Dgeni([docsPackage]);
  return dgeni.generate();
});
