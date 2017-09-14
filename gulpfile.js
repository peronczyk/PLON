/**
 * =================================================================================
 *
 * PLON example gulpfile.js
 *
 * @author		Bartosz Perończyk <peronczyk.com>
 * @created		2017-09-14
 * @modified	2017-09-14
 * @repository	https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

var config = {

	// Configure your script address/domain to be able of using 'serve' action
	domain: 'http://localhost/Tests/gulp-modules/',

	// Provide list of JS files that should be concatenated
	jsFiles: [],
};


/**
 * If you are using this file with PLON installed as NPM package
 * provide correct path below.
 */

var plon = require('./gulp/index.js')(config);