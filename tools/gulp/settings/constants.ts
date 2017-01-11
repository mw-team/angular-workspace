export const MODULE_BUNDLE = 'module.umd.js';
export const MODULE_NAME = 'my.module';


const projectInfo = require('../../../package.json');
export const PROJECT_VERSION = projectInfo.version;
export const PROJECT_NAME = projectInfo.name;


export const SASS_AUTOPREFIXER_OPTIONS = {
  browsers: [
    'last 2 versions',
    'not ie <= 10',
    'not ie_mob <= 10',
  ],
  cascade: false,
};

export const HTML_MINIFIER_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

export const LICENSE_BANNER = `/**
  * @license UI Components v${PROJECT_VERSION}
  * Copyright (c) 2017 MWTeam, Inc.
  * License: MIT
  */`;

export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];
