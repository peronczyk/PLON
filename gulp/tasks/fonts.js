/**
 * PLON Gulp task: fonts
 */

module.exports = function() {
	'use strict';

	return gulp.task('fonts', function() {
		return gulp
			.src(config.assetsDir + config.subDirs.assets.fonts + '**/*.' + config.fileExtensions.fonts)
			.pipe(gulp.dest(config.distDir + config.subDirs.dist.fonts));
	});
}