# Gulp

## Using

You can use PLON Gulp in two ways:

1. **As NPM package** - just copy `gulpfile.js` into your project directory and andjust configuration in it. We recommend this option.
2. Or just copy file `gulpfile.js` and `gulp/` directory into your project.

## Installation

To be able of using PLON Gulp tasks install required npm packages:
```bash
$ npm install
```

Than you can generate dist files by entering:
```bash
$ gulp
```
or any other gulp command described bellow.

## Commands

* `gulp sass` - Compiles all SASS files from 'assets' and moves results to 'dist'.
* `gulp js` - Uglifies and concatenates all JS files from 'assets' and moves results to 'dist'.
* `gulp images` - Copies all images from 'assets' to 'dist'.
* `gulp fonts` - Copies all fonts from 'assets' to 'dist'.
* `gulp watch` - Enters watch mode. Monitors changes in JS, CSS, Images and Fonts assets.
* `gulp serve` - Enters watch mode and starts simple server that serves same browser experience on different browsers through generated URL.

## Environments

Gulp tasks can work in two modes:
1. "**development**" mode creates unminified files with source maps added. You can use this mode by adding `-D`, `--dev` or `--development` switch in console, eg.: `$ gulp js -D`. This is default mode, so if you use `$ gulp` it means that you use "dev" mode.

2. "**production**" mode creates minified files without source maps. You can use this mode by adding `-P`, `--prod` or `--production` switch in console, eg.: `$ gulp js -P`.

## Adding new tasks

PLON Gulp allows you to add new task to existing structure. You can do that in two ways:

1. By writing your task directly in `gulpfile.js`. There is `gulp` variable available.
2. By creating custom task module the same way as they are created in _gulp/tasks/_ directory. This task could be loaded this way:
```javascript
var plon = require('./node_modules/plon/gulp/index.js')(config);

// Second param is a location of directory that contains task module
plon.importTask('some-custom-task', '../../../gulp/tasks/');
```