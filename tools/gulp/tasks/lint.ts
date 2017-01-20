import {task} from 'gulp';
import {execNodeTask, formatTask} from '../helpers';
import {DIST_ROOT, SOURCE_ROOT, dirs, resolve} from '../settings/paths';

task('lint', ['tslint', 'stylelint', 'madge']);
task('madge', ['build:release'], execNodeTask('madge', ['--circular', DIST_ROOT]));
task('stylelint', execNodeTask('stylelint', [resolve(SOURCE_ROOT, '/**/*.scss'), '--config', resolve(dirs.tools.lint, 'stylelint.json'), '--syntax', 'scss']));
task('tslint', execNodeTask('tslint', ['-c', resolve(dirs.tools.lint, 'tslint.json'), resolve(SOURCE_ROOT, '/**/*.ts')]));

task('format:check', formatTask());
task('format', formatTask(false));
