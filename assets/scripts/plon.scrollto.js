/**
 * =================================================================================
 *
 * PLON Component : ScrollTo
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

			// Decide how fast page will be scrolled
			speed: 25,

			// Decide how far from destination viewport will stop
			shift: 0
		},

		// Events that should immedietly stop smooth scrolling
		scrollBreakEvents = 'mousewheel.scrollto DOMMouseScroll.scrollto',

		$scrollTarget,
		scrollTime,
		offsetTop,
		scrolled;


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.scrollTo = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		// Definitions
		var _self			= $(this),
			$htmlAndBody	= $('html,body'),
			$document		= $(document);

		if (config.debug) console.info('Plugin loaded: ScrollTo');

		this.filter('a').on('click', function(event) {
			event.preventDefault();

			// Stop if there is no target specified (no #element in href)
			if (!this.hash) {
				if (config.debug) console.log('[PLON / ScrollTo] Clicked element didn\' have hash in href');
				return false;
			}

			$scrollTarget = $(this.hash);

			// Check if target element exists
			if ($scrollTarget.length > 0) {

				offsetTop	= $scrollTarget.offset().top + config.shift;
				scrolled	= $(window).scrollTop();
				scrollTime	= Math.sqrt(Math.abs(offsetTop - scrolled)) * config.speed;

				$document.on(scrollBreakEvents, function() {
					$htmlAndBody.stop();
					$document.off(scrollBreakEvents);
					if (config.debug) console.log('[PLON / ScrollTo] Scrolling stopped by breaking event');
				});

				$htmlAndBody.stop().animate(
					{scrollTop: offsetTop},
					scrollTime,
					function() {
						$document.off(scrollBreakEvents);
					});

				window.history.pushState(null, null, this.href);

				if (config.debug) console.log('[PLON / ScrollTo] Scrolled to ' + this.hash + ', placed at pos: ' + offsetTop + 'px, which took: ' + scrollTime + 's');
			}

			else if (config.debug) console.log('[PLON / ScrollTo] Element ' + this.hash + ' not found');
		});

		return _self;

	};

})(jQuery);