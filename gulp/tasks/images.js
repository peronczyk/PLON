/**
 * PLON Gulp task: images
 */

module.exports = function() {
	'use strict';

	var imagemin = require('gulp-imagemin');

	return gulp.task('images', function() {
		return gulp
			.src(config.assetsDir + config.subDirs.assets.images + '**/*.' + config.fileExtensions.images)
			.pipe(imagemin())
			.pipe(gulp.dest(config.distDir + config.subDirs.dist.images));
	});
}