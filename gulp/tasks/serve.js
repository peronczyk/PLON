/**
 * PLON Gulp task: serve
 */

module.exports = function() {
	'use strict';

	return gulp.task('serve', ['watch'], function() {
		if (!config.domain) {
			gutil.log(style.error('Error'), 'Task', style.task('serve'), 'couldn\'t be run because domain is not set in configuration.');
			return false;
		}

		browserSync.init({
			proxy: config.domain,
			online: false,
			reloadOnRestart: true
		});

		gulp
			.watch(['**/*.' + config.fileExtensions.watched])
			.on('change', browserSync.reload);
	});
}