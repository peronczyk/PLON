/**
 * =================================================================================
 *
 * PLON Component : VideoAutoPause
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-05-31
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.VideoAutoPause = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @var {String} scrollElementSelector
	 * @var {Object} options
	 */

	constructor(options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in conssole
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * CSS selector for videos that should be pause/played.
			 * @var {String}
			 */
			videoSelector: 'video',

			/**
			 * Events namespace.
			 * @var {String}
			 */
			eventsNameSpace: '.plon.videoautopause',
		};

		this.config = { ...defaults, ...options };
		this.$videos = $(this.config.videoSelector);

		if (!this.$videos.length) {
			this.debugLog(`No video elements were found in current document.`);
			return false;
		}

		this.visibilityStateSupport = this.checkVisibilityStateSupport();

		// Modern browser with visibilityState support
		if (this.visibilityStateSupport) {
			$(document).on('visibilitychange' + this.config.eventsNameSpace, () => {
				(document.hidden)
					? this.pauseVideos()
					: this.playVideos();
			});
		}

		// Older browsers
		else {
			this.debugLog(`Browser do not support visibilityState. Switched to blur/focus mode`);

			$(window).on('blur' + this.config.eventsNameSpace + ' focus' + this.config.eventsNameSpace, (event) => {
				(event.type === 'blur')
					? this.pauseVideos()
					: this.playVideos();
			});
		}

		this.debugLog(`Initiated. Videos found: ${this.$videos.length}`, 'info');
	}


	/** ----------------------------------------------------------------------------
	 * Check if browser supports visibilityState
	 */

	checkVisibilityStateSupport() {
		const browserPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];

		for (let i = 0; i < browserPrefixes.length; i++) {
			if ((browserPrefixes[i] + 'VisibilityState') in document) {
				return true;
			}
		}

		return false;
	}


	/** ----------------------------------------------------------------------------
	 * PLAY VIDEOS
	 */

	playVideos() {
		this.debugLog(`Videos played.`);

		this.$videos.each((index, elem) => {
			elem.play();
		});
	};


	/** ----------------------------------------------------------------------------
	 * PAUSE VIDEOS
	 */

	pauseVideos() {
		this.debugLog(`Viedos paused.`);

		this.$videos.each((index, elem) => {
			elem.pause();
		});

	};


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / VideoAutoPause]', message);
		}
	}
};