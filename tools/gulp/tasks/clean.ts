import {task} from 'gulp';
import {cleanTask} from '../helpers';
import {DIST_ROOT} from '../settings/paths';


task('clean', cleanTask(DIST_ROOT));
