
/*	================================================================================
 *
 *	GULP FILE
 *
 *	--------------------------------------------------------------------------------
 *
 *	AVAILABLE TASKS:
 *
 *	clean-dist
 *		Removes all content from 'dist' directory
 *
 *	css
 *		Compiles all SASS files from 'assets' and moves results to 'dist'
 *
 *	js
 *		Uglifies and concatenates all JS files from 'assets'
 *		and moves results to 'dist'.
 *
 *	images
 *		Copies all images from 'assets' to 'dist'
 *
 *	fonts
 *		Copies all fonts from 'assets' to 'dist'
 *
 *	default
 *		Runs tasks: clean-dist, js, css, images, fonts
 *
 *	watch
 *		Enters watch mode. Monitors changes in JS, CSS, Images
 *		and Fonts assets.
 *
 *	serve
 *		Enters watch mode, starts simple server
 *
 *	================================================================================ */


'use strict';


/*	================================================================================
 *	CONFIGURATION
 *	================================================================================ */

var

	// Include gulp
	gulp			= require('gulp'),

	// Include plugins
	del				= require('del'),
	runSequence		= require('run-sequence'),
	rename			= require('gulp-rename'),
	uglify			= require('gulp-uglify'),
	sass			= require('gulp-sass'),
	concat			= require('gulp-concat'),
	gutil			= require('gulp-util'),
	autoprefixer 	= require('gulp-autoprefixer'),
	sourcemaps 		= require('gulp-sourcemaps'),
	browserSync 	= require('browser-sync').create(),
	notify 			= require('gulp-notify'),

	// Include external configuration file
	config			= require('./gulpconfig.js')();


/*	================================================================================
 *	ERROR HANDLING
 *	================================================================================ */

var reportError = function(error) {

	var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

	if (config.errorHandlerNotify == true) {
		notify({
			title: 'Task Failed [' + error.plugin + ']',
			message: lineNumber + 'See console.',
			sound: config.errorHandlerNotifySound
		}).write(error);
	}

	if (config.errorHandlerBeep == true) {
		gutil.beep();
	}

	var report = '',
		chalk = gutil.colors.white.bgRed;

	report += chalk('TASK:') + ' [' + error.plugin + ']\n';
	report += chalk('PROB:') + ' ' + error.message + '\n';
	if (error.lineNumber)	{ report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
	if (error.fileName)		{ report += chalk('FILE:') + ' ' + error.fileName + '\n'; }

	console.error(report);

	this.emit('end');
};


/*	================================================================================
 *	TASKS
 *	================================================================================ */


/*	--------------------------------------------------------------------------------
 *	Task: DELETE DIST
 */

gulp.task('clean-dist', function() {
	return del(config.basePaths.dist);
});


/*	--------------------------------------------------------------------------------
 *	Task: CSS
 */

gulp.task('css', function() {

	return gulp.src([
			config.basePaths.assets + config.paths.assets.styles + '*.scss'
		])

		// Save uncompressed
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', reportError))
		.pipe(autoprefixer({
			browsers: config.compatibility
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.basePaths.dist + config.paths.dist.styles))
		.pipe(browserSync.stream())

		// Save compressed
		.pipe(rename({suffix: ".min"}))
		.pipe(sass({outputStyle: 'compressed'}).on('error', reportError))
		.pipe(gulp.dest(config.basePaths.dist + config.paths.dist.styles))
		.pipe(browserSync.stream());
});


/*	--------------------------------------------------------------------------------
 *	Task: JS
 */

gulp.task('js', function() {

	var assetsDir	= config.basePaths.assets + config.paths.assets.scripts,
		distDir		= config.basePaths.dist + config.paths.dist.scripts;

	// Merge all files together
	if (config.saveJSConcatenated == true) {
		var concatenatedJSFiles = gulp.src(config.jsFiles)

			// Save uncompressed
			.pipe(sourcemaps.init())
			.pipe(concat({path: 'scripts.js'}).on('error', reportError))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(distDir))
			.pipe(browserSync.stream())

			// Save compressed
			.pipe(uglify().on('error', reportError))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(distDir))
			.pipe(browserSync.stream());
	}

	// Save all files separately
	if (config.saveJSSeparately == true) {
		var allJSFiles = gulp.src(config.jsFiles)

			// Save all files
			.pipe(gulp.dest(distDir))
			.pipe(browserSync.stream())

			// Save all files compressed
			.pipe(uglify().on('error', reportError))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(distDir))
			.pipe(browserSync.stream());
	}
});


/*	--------------------------------------------------------------------------------
 *	Task: IMAGES
 */

gulp.task('images', function() {
	return gulp.src([
			config.basePaths.assets + config.paths.assets.images + '**/*.' + config.fileExtensions.images
		])
		.pipe(gulp.dest(config.basePaths.dist + config.paths.dist.images))
		.pipe(browserSync.stream());
});


/*	--------------------------------------------------------------------------------
 *	Task: FONTS
 */

gulp.task('fonts', function() {
	return gulp.src([
			config.basePaths.assets + config.paths.assets.fonts + '**/*.' + config.fileExtensions.fonts
		])
		.pipe(gulp.dest(config.basePaths.dist + config.paths.dist.fonts))
		.pipe(browserSync.stream());
});


/*	--------------------------------------------------------------------------------
 *	Task: DEFAULT
 */

gulp.task('default', function(callback) {
	runSequence(
		'clean-dist',
		['css', 'js', 'images', 'fonts'],
		callback
	);
});


/*	--------------------------------------------------------------------------------
 *	Task: WATCH
 */

gulp.task('watch', ['css', 'js', 'images', 'fonts'], function() {
	gulp.watch(
		[config.basePaths.assets + config.paths.assets.styles + '**/*.scss'],
		['css']
	);

	gulp.watch(
		[config.basePaths.assets + config.paths.assets.scripts + '**/*.js'],
		['js']
	);

	gulp.watch(
		[config.basePaths.assets + config.paths.assets.images + '**/*.' + config.fileExtensions.images],
		['images']
	);

	gulp.watch(
		[config.basePaths.assets + config.paths.assets.fonts + '**/*.' + config.fileExtensions.fonts],
		['fonts']
	);
});


/*	--------------------------------------------------------------------------------
 *	Task: SERVE
 */

gulp.task('serve', ['watch'], function() {

	if (config.domain && config.domain.length !== 0) {
		browserSync.init({
			proxy: config.domain
		});

		gulp.watch([
			'**/*.' + config.fileExtensions.watched
		])
		.on('change', browserSync.reload);
	}
	else {
		// Display error if domain was not configured
		console.error('Error in serve task: Domain not configured');
		return false;
	}
});
