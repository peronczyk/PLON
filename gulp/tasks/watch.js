/**
 * PLON Gulp task: watch
 */

module.exports = function() {
	'use strict';

	return gulp.task('watch', config.tasksToWatch, function() {

		if (config.tasksToWatch && config.tasksToWatch.length > 0) {
			for (var i = 0; i < config.tasksToWatch.length; i++) {
				if (config.subDirs.assets[config.tasksToWatch[i]]) {
					var pathToWatch = config.assetsDir + config.subDirs.assets[config.tasksToWatch[i]] + '**';
					gutil.log('-- Watching', style.path(pathToWatch));

					gulp.watch(
						[pathToWatch],
						[config.tasksToWatch[i]]
					);
				}
				else {
					gutil.log('-- Could not watch task', style.task(config.tasksToWatch[i]), 'because there is no configured path that correspond to it.');
				}
			}
		}
		else {
			gutil.log('No tasks was set to watch');
		}
	});
}