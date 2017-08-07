
/*	================================================================================
 *
 *	GULP EXTERNAL CONFIGURATION FILE
 *
 *	================================================================================ */


'use strict';

module.exports = function() {

	var

		/*	------------------------------------------------------------------------
		 *	FUNCTIONALITY CONFIGURATION
		 */

		// Add source maps to JS & CSS files (function in development)
		// Accept values: true, false

		addSourceMaps			= true,


		// Saves uncompressed (unminified) files next to compressed ones
		// Accept values: true, false

		saveUncompressedCopies	= true,


		// Save all JS files concatenated (merged together)
		// to one dist file (scripts.js)
		// Accept values: true, false

		saveJSConcatenated		= true,


		// Save all JS files separately in dist folder.
		// Accept values: true, false

		saveJSSeparately		= true,


		// Enable sound when an error occurs
		// Accept values: true, false

		errorHandlerBeep		= true,


		// Enable notify when an error occurs
		// Accept values: true, false

		errorHandlerNotify		= true,


		// Sound type when an error occurs
		// See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults

		errorHandlerNotifySound	= 'Sosumi',


		/*	------------------------------------------------------------------------
		 *	AUTOPREFIXER
		 *  About: https://github.com/postcss/autoprefixer
		 *  Settings tester: http://autoprefixer.github.io/
		*/

		compatibility = [
			'last 2 versions',
			'ie >= 9',
			'Android >= 2.3'
		],


		/*	------------------------------------------------------------------------
		 *  DOMAIN
		 */

		domain = '',


		/*	------------------------------------------------------------------------
		 *	BASE PATHS
		 */

		basePaths = {
			assets		: 'assets/',
			dist		: 'dist/',
		},


		/*	------------------------------------------------------------------------
		 *	PATHS
		 */

		paths = {

			assets: {
				scripts	: 'scripts/',
				styles	: 'styles/',
				images	: 'images/',
				fonts	: 'fonts/'
			},

			dist: {
				scripts	: 'scripts/',
				styles	: 'styles/',
				images	: 'images/',
				fonts	: 'fonts/'
			}
		},


		/*	------------------------------------------------------------------------
		 *	FILE & EXTENSIONS LISTS
		 */

		// List of JS file names to compile.
		// Can be: '**/*.js' to compile all JS files basing on its names
		// or ['file1.js', 'file2.js', ...]

		jsFiles = [
			'node_modules/jquery/dist/jquery.js',
			basePaths.assets + paths.assets.scripts + '**/*.js',
		],


		// List of file extensions to filter files while moving them
		// from assets to dist. You can write list of extensions this way:
		// '{ext1,ext2,ext3...}' or just put '*' (don't use spaces)
		// Remember that this option is case sensitive.

		fileExtensions = {
			fonts		: '{ttf,otf,svg,woff,woff2,eot,TTF,OTF,SVG,WOFF,WOFF2,EOT}',
			images		: '{jpg,jpeg,png,gif,svg,JPG,JPEG,PNG,GIF,SVG}',

			// When files are changing during Browser Sync running
			// the page would be refreshed

			watched		: '{php,PHP}'
		};


	// Return all configured variables. If you added new variable put it below.

	return {
		addSourceMaps			: addSourceMaps,
		saveUncompressedCopies	: saveUncompressedCopies,
		saveJSConcatenated		: saveJSConcatenated,
		saveJSSeparately		: saveJSSeparately,
		domain					: domain,
		basePaths				: basePaths,
		paths					: paths,
		jsFiles					: jsFiles,
		fileExtensions			: fileExtensions,
		compatibility			: compatibility,
		errorHandlerBeep		: errorHandlerBeep,
		errorHandlerNotify		: errorHandlerNotify,
		errorHandlerNotifySound	: errorHandlerNotifySound
	};

};