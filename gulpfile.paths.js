/**
 * Path Definitions
 */

/* eslint-disable semi */

// FIXME use path.join in all cases

var paths = {};

paths.app = './app';
paths.build = './build';
paths.config = paths.app + '/config.json';
paths.css = {
  all: paths.app + '/**/*.css',
  app: paths.app + '/app.css'
};
paths.icons = {
  app: paths.app + '/components/Icon/images/*.svg'
};
paths.images = {
  app: [
    '!' + paths.icons.app,
    paths.app + '/**/*.svg',
    paths.app + '/**/*.jpg',
    paths.app + '/**/*.png',
    paths.app + '/**/*.gif'
  ]
};

paths.webpack = {
  // entry point(s) for webpack build
  entry: paths.app + '/**/reactComponentDirectives.js',
  // top-level directives that are imported and should also be watched
  topLevel: [
    paths.app + '/**/editorHeaderDirective.js',
    paths.app + '/**/suggestionsPanelDirective.js',
    paths.app + '/**/mainContentDirective.js',
    paths.app + '/**/transUnitSourceDirective.js'
  ],
  // where to search for imported modules, must be absolute path
  modules: __dirname + '/app/components',
  // extensions that are considered modules by webpack
  // (empty string is needed for when the extension is given when importing)
  moduleExtensions: ['', '.js', '.jsx']
}

paths.js = {
  app: [
    paths.app + '/app.js',
    paths.app + '/**/*.js',
    // compiled to bundle by webpack, so exclude
    '!' + paths.webpack.entry,
    '!' + paths.app + '/**/editorHeaderDirective.js',
    '!' + paths.app + '/**/suggestionsPanelDirective.js',
    '!' + paths.app + '/**/mainContentDirective.js',
    '!' + paths.app + '/**/transUnitSourceDirective.js'
  ]
}

paths.jsx = paths.app + '/**/*.jsx'

paths.modernizr = {
  buildName: 'modernizr-custom.js'
};
paths.templates = ['!' + paths.app + '/index.html', paths.app + '/**/*.html'];
paths.translations = {
  build: paths.build + '/translations',
  po: paths.app + '/components/translations',
  src: {
    plain: [
      paths.app + '/**/*.html',
      paths.app + '/**/*.js'
    ],
    // has to be run through babel before extracting strings
    jsx: paths.jsx
  }
};

module.exports = paths;
