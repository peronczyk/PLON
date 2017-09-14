/**
 * PLON Gulp task: js
 */

module.exports = function() {
	'use strict';

	var babel = require('gulp-babel');
	var sourcemaps = require('gulp-sourcemaps');
	var concat = require('gulp-concat');
	var uglify = require('gulp-uglify');

	return gulp.task('js', function() {
		var jsFilesList;
		if (config.jsFiles && config.jsFiles.length > 0) {
			jsFilesList = config.jsFiles;
		}
		else jsFilesList = config.assetsDir + config.subDirs.assets.js + '*.js';

		return gulp
			.src(jsFilesList)
			.pipe(env.development ? sourcemaps.init() : gutil.noop())
			.pipe(babel({
				presets: ['env']
			}).on('error', reportError))
			.pipe(concat({path: config.jsConcatenatedFileName}).on('error', reportError))
			.pipe(env.development ? sourcemaps.write() : gutil.noop())
			.pipe(env.production ? uglify().on('error', reportError) : gutil.noop())
			.pipe(gulp.dest(config.distDir + config.subDirs.dist.js));
	});
}