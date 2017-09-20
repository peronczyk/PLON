/**
 * =================================================================================
 *
 * PLON Gulp
 * Example gulpfile.js
 *
 * @author		Bartosz Perończyk <peronczyk.com>
 * @created		2017-09-10
 * @modified	2017-09-14
 * @repository	https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

var options = {

	// Configure your script address/domain to be able of using 'serve' action
	domain: 'http://localhost/Tests/gulp-modules/',

	// Provide list of JS files that should be concatenated
	jsFiles: [],

	// Task that will be run as default "$ gulp"
	defaultTasks: ['sass', 'js', 'images', 'fonts', 'add-jquery'],
};


/**
 * If you are using this file with PLON installed as NPM package
 * provide correct path below.
 */

var plon = require('./gulp/index.js')(options);


/**
 * Custom task that shows how to add your own tasks.
 * It moves jQuery from NPM package to your dist directory.
 */

gulp.task('add-jquery', function() {
	return gulp
		.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(config.distDir + config.subDirs.dist.js));
});