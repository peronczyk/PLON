/**
 * =================================================================================
 *
 * PLON Component : VideoAutoPause
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.VideoAutoPause = function(options) {

	'use strict';

	const defaults = {
		debug: false,
		videoSelector: 'video',
		eventsNameSpace: '.plon.videoautopause',
	};
	const browserPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];
	var visibilityStateSupport = false; // Stores information about page visibility state

	this.$videos;


	/** ----------------------------------------------------------------------------
	 * PLAY VIDEOS
	 */

	this.playVideos = () => {
		this.$videos.each(($elem) => {
			$elem.get(0).play();
		});
	};


	/** ----------------------------------------------------------------------------
	 * PAUSE VIDEOS
	 */

	this.pauseVideos = () => {
		this.$videos.each(($elem) => {
			$elem.get(0).pause();
		});
	};


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	this.init = () => {

		// Setup configuration
		this.config = Object.assign({}, defaults, options);

		this.$videos = $(this.config.videoSelector);

		if (!this.$videos.length) {
			if (this.config.debug) {
				console.info('[PLON / VideoAutoPause] No video elements were found in current document.');
			}
			return false;
		}

		// Check if browser supports visibilityState
		for (let i = 0; i < browserPrefixes.length; i++) {
			if ((browserPrefixes[i] + 'VisibilityState') in document) {
				visibilityStateSupport = true;
				break;
			}
		}

		// Modern browser with visibilityState support
		if (visibilityStateSupport) {
			if (this.config.debug) {
				console.info('[PLON / VideoAutoPause] Browser supports visibilityState');
			}

			$(document).on('visibilitychange' + this.config.eventsNameSpace, () => {
				(document.hidden)
					? this.pauseVideos()
					: this.playVideos();
			});
		}

		// Older browsers
		else {
			console.info('[PLON / VideoAutoPause] Browser do not support visibilityState. Switched to blur/focus mode');

			$(window).on('blur' + this.config.eventsNameSpace + ' focus' + this.config.eventsNameSpace, (event) => {
				(event.type === 'blur')
					? this.pauseVideos()
					: this.playVideos();
			});
		}

		if (this.config.debug) {
			console.info('Plugin loaded: videoAutoPause');
		}
	};

	return this.init();
};