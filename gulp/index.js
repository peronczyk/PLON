/**
 * =================================================================================
 *
 * PLON Gulp
 * Starting file
 *
 * @author		Bartosz Perończyk <peronczyk.com>
 * @created		2017-09-10
 * @modified	2017-09-14
 * @repository	https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

module.exports = function(passedConfig) {
	'use strict';

	/**
	 * Load global modules
	 */

	global.gulp = require('gulp');
	global.gutil = require('gulp-util');
	global.notify = require('gulp-notify');
	global.browserSync = require('browser-sync').create();


	/**
	 * Console styling shorthands
	 */

	global.style = {
		error: gutil.colors.black.bgRed,
		path: gutil.colors.magenta,
		task: gutil.colors.cyan
	};


	/**
	 * Set up configuration
	 */

	global.config = require('./default-config.js');

	// Overwrite default configuration with user configuration
	if (passedConfig) {
		for (var key in passedConfig) {
			config[key] = passedConfig[key];
		}
	}


	/**
	 * Set environment type
	 * To use one of the environments types use one of the acceptable options
	 * while using console, eg.: "$ gulp --D" (development)
	 */

	global.env = {
		production : (gutil.env.production || gutil.env.prod || gutil.env.P) ? true : false,
		development: (gutil.env.development || gutil.env.dev || gutil.env.D) ? true : false
	}

	// Set default enviroment to development if no options was passed in console
	if (!env.production && !env.development) env.development = true;


	/**
	 * Global task importer
	 */

	global.importTask = function(taskFile, taskDir = './tasks/') {
		var importedTask = require(taskDir + taskFile);

		if (typeof importedTask === 'function') {
			importedTask();
			gutil.log('Task', style.task(taskFile), 'loaded from', style.path(taskDir));
		}
		else {
			gutil.log(style.error('Error'), 'Could not import Gulp task', style.task(taskFile), 'from', style.path(taskDir));
		}
	};


	/**
	 * Error reporting helper
	 */

	global.reportError = function(error) {
		// Prefer formatted messages if returned
		var message = (error.formatted) ? error.formatted : error.toString();

		// Prefer relative paths if returned
		var file = (error.relativePath) ? error.relativePath : error.fileName;

		// Some plugins don't give 'line' property, eg.: 'gulp-babel'
		var line = (error.line) ? error.line : error.loc.line + ', column: ' + error.loc.column;

		// Open system notification toast with basic info
		notify({
			title   : 'Task Failed [' + error.plugin + ']',
			message : 'File: ' + file + '\nLine: ' + line,
			sound   : 'Sosumi'
		}).write(error);

		// Beep 'Sosumi' sound again
		gutil.beep();

		// Log additional informations in to console window
		gutil.log(style.error(error.name), 'in file', style.path(file), '[', style.task(error.plugin), ']\n', message);

		// Prevent the 'watch' task from stopping
		this.emit('end');
	}


	/**
	 * Import tasks
	 */

	for (var taskNum in config.tasksToLoad) {
		importTask(config.tasksToLoad[taskNum]);
	}


	/**
	 * Default task
	 */

	gulp.task('default', config.defaultTasks);

	return {gulp, gutil, config, importTask, env};
}