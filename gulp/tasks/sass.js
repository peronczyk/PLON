/**
 * PLON Gulp task: sass
 */

module.exports = function() {
	'use strict';

	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	var sourcemaps = require('gulp-sourcemaps');

	return gulp.task('sass', function() {
		var scssFilesList = config.assetsDir + config.subDirs.assets.sass + '*.scss';

		return gulp
			.src(scssFilesList)
			.pipe(env.development ? sourcemaps.init() : gutil.noop())
			.pipe(sass({
				outputStyle: env.production ? 'compressed' : 'nested'
			}).on('error', reportError))
			.pipe(autoprefixer({
				browsers: config.compatibility
			}).on('error', reportError))
			.pipe(env.development ? sourcemaps.write(undefined, {
				sourceRoot: null
			}) : gutil.noop())
			.pipe(gulp.dest(config.distDir + config.subDirs.dist.css));
	});
}