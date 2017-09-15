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


(function($) {

	'use strict';


	/** ----------------------------------------------------------------------------
	 * PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug: 0,
		},
		visibilityStateSupport = false, // Stores information about page visibility state
		browserPrefixes = ['webkit', 'moz', 'ms', 'o'];


	/** ----------------------------------------------------------------------------
	 * PLAY VIDEOS
	 */

	function playVideos(config, $videos) {
		if (config.debug) console.info('videoAutoPause: Page is visible, play videos');
		$videos.each(function() {
			$(this).get(0).play();
		});
	}


	/** ----------------------------------------------------------------------------
	 * PAUSE VIDEOS
	 */

	function pauseVideos(config, $videos) {
		if (config.debug) console.info('videoAutoPause: Page is hidden, pause videos');
		$videos.each(function() {
			$(this).get(0).pause();
		});
	}


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.videoAutoPause = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		// Definitions
		var _self = $(this);

		if (config.debug) console.info('Plugin loaded: videoAutoPause');

		if (_self.length < 1) {
			if (config.debug) console.info('videoAutoPause: no video elements were selected');
			return false;
		}

		// Check if browser supports visibilityState
		if ('visibilityState' in document) visibilityStateSupport = true;
		else {
			for (var i = 0; i < browserPrefixes.length; i++) {
				if ((browserPrefixes[i] + 'VisibilityState') in document) {
					visibilityStateSupport = true;
					break;
				}
			}
		}

		// Modern browser with visibilityState support
		if (visibilityStateSupport) {
			console.info('videoAutoPause: Browser supports visibilityState');
			$(document).on('visibilitychange.videoautopause', function() {
				if (document.hidden) pauseVideos(config, _self);
				else playVideos(config, _self);
			});
		}

		// Older browsers
		else {
			console.info('videoAutoPause: Browser don\'t support visibilityState. Switched to blur/focus mode');
			$(window).on('blur.videoautopause focus.videoautopause', function(e) {
				if (e.type === 'blur') pauseVideos(config, _self);
				else playVideos(config, _self);
			});
		}
	}

})(jQuery);