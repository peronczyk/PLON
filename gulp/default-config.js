/**
 * =================================================================================
 *
 * PLON Gulp
 * Default configuration file
 *
 * @author		Bartosz Perończyk <peronczyk.com>
 * @created		2017-09-10
 * @modified	2017-09-14
 * @repository	https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

module.exports = {

	/**
	 * List of JS files that should be processed
	 */

	jsFiles: [],


	/**
	 * Name of file that is a result of JS files concatenation
	 */

	jsConcatenatedFileName: 'scripts.js',


	/**
	 * Directories
	 */

	assetsDir: 'assets/',

	distDir: 'dist/',

	subDirs: {
		assets: {
			sass: 'styles/',
			js: 'scripts/',
			images: 'images/',
			fonts: 'fonts/'
		},
		dist: {
			css: 'styles/',
			js: 'scripts/',
			images: 'images/',
			fonts: 'fonts/'
		}
	},


	/**
	 * Domain used within 'serve' task. It is used to hot reload browser.
	 */

	domain: '',


	/**
	 * Tasks configuration
	 */

	tasksToLoad: ['sass', 'js', 'js-separate', 'images', 'fonts', 'watch', 'serve'],

	tasksToWatch: ['sass', 'js', 'images', 'fonts'],

	defaultTasks: ['sass', 'js', 'images', 'fonts'],


	/**
	 * Autoprefixer compatibility settings
	 */

	compatibility: [
		'last 2 versions',
		'ie >= 9',
		'Android >= 2.3',
		'ios >= 7'
	],


	/**
	 * List of file extensions to filter files while moving them
	 * from assets to dist. You can write list of extensions this way:
	 * '{ext1,ext2,ext3...}' or just put '*' (don't use spaces)
	 * This option is case sensitive.
	 */

	fileExtensions: {
		fonts		: '{ttf,TTF,otf,OTF,svg,SVG,woff,WOFF,woff2,WOFF2,eot,EOT}',
		images		: '{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG}',
		watched		: '{php,PHP,html,HTML,htm,HTM}'
	}
}