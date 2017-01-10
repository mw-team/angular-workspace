import {task} from 'gulp';
import * as gulpRunSequence from 'run-sequence';

import {execTask, cleanTask} from '../helpers';
import {dirs, resolve} from '../settings/paths';


task(':build:release:clean-spec', cleanTask(resolve(dirs.dist, '**/*.spec.*')));


task('build:release', function(done: () => void) {
  // Synchronously run those tasks.
  gulpRunSequence(
    'clean',
    ':build:components:ngc',
    ':build:release:clean-spec',
    done
  );
});
