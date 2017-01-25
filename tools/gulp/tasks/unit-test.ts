import * as gulp from 'gulp';
import {task} from 'gulp';
import * as path from 'path';

import {PROJECT_ROOT, COMPONENTS_DIR, dirs, resolve} from '../settings/paths';
import {sequenceTask} from '../helpers';

const gulpMerge = require('merge2');
const karma = require('karma');
const runSequence = require('run-sequence');

/** Copies deps for unit tests to the build output. */
task(':build:test:vendor', function() {
  const npmVendorFiles = [
    '@angular', 'core-js/client', 'hammerjs', 'rxjs', 'systemjs/dist', 'zone.js/dist'
  ];

  return gulpMerge(
    npmVendorFiles.map(function(root) {
      const glob = resolve(root, '**/*.+(js|js.map)');
      return gulp.src(resolve('node_modules', glob))
        .pipe(gulp.dest(resolve('dist/vendor', root)));
    }));
});

/** Builds dependencies for unit tests. */
task(':test:deps', sequenceTask(
  'clean',
  [
    ':build:test:vendor',
    ':build:components:assets',
    ':build:components:scss',
    ':build:components:spec',
  ]
));


/** Build unit test dependencies and then inlines resources (html, css) into the JS output. */
task(':test:deps:inline', sequenceTask(':test:deps', ':inline-resources'));

/**
 * Runs the unit tests once with inlined resources (html, css). Does not watch for changes.
 *
 * This task should be used when running tests on the CI server.
 */
task('test:single-run', [':test:deps:inline'], (done: () => void) => {
  new karma.Server({
    configFile: resolve(dirs.tools.test, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});

/**
 * [Watch task] Runs the unit tests, rebuilding and re-testing when sources change.
 * Does not inline resources. Note that this doesn't use Karma's built-in file
 * watching. Due to the way our build process is set up, Karma ends up firing
 * it's change detection for every file that is written to disk, which causes
 * it to run tests multiple time and makes it hard to follow the console output.
 * This approach runs the Karma server and then depends on the Gulp API to tell
 * Karma when to run the tests.
 *
 * This task should be used when running unit tests locally.
 */
task('test', [':test:deps'], () => {
  let patternRoot = path.join(COMPONENTS_DIR, '**/*');

  // Configure the Karma server and override the autoWatch and singleRun just in case.
  let server = new karma.Server({
    configFile: resolve(dirs.tools.test, 'karma.conf.js'),
    autoWatch: false,
    singleRun: false
  });

  // Refreshes Karma's file list and schedules a test run.
  let runTests = () => {
    server.refreshFiles().then(() => server._injector.get('executor').schedule());
  };

  // Boot up the test server and run the tests whenever a new browser connects.
  server.start();
  server.on('browser_register', runTests);

  // Watch for file changes, rebuild and run the tests.
  gulp.watch(resolve(COMPONENTS_DIR, '**/*.ts'), () => runSequence(':build:components:spec', runTests));
  gulp.watch(resolve(COMPONENTS_DIR, '**/*.scss'), () => runSequence(':build:components:scss', runTests));
  gulp.watch(resolve(COMPONENTS_DIR, '**/*.html'), () => runSequence(':build:components:assets', runTests));
});
