
/*	================================================================================
 *
 *	JQ: SCROLL TO
 *
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Created			: 2015-02-06
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Adds ability to smooth scroll page to specific element. Scrolling stops
 *	when you use mouse scroll.
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	$('[data-scrollto]').scrollTo();
 *
 *	@speed	- controlls speed of scrolling.
 *			  Larger the number is, longer the scrolling lasts
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug	: 0,
			speed	: 25
		},
		scrollBreakEvents	= 'mousewheel.scrollto DOMMouseScroll.scrollto', // Events that should immedietly stop smooth scrolling
		$scrollTarget,	// Stores DOM element that we will scroll to
		diff,			// Decide how much time page will be scrolled
		offsetTop,
		scrolled;


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.scrollTo = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self			= $(this),
			$htmlAndBody	= $('html,body'),
			$document		= $(document);

		if (config.debug) console.info('Plugin loaded: scrollTo');

		this.filter('a').on('click', function(event) {
			event.preventDefault();

			// Stop if there is no target specified (no #element in href)
			if (!this.hash) {
				if (config.debug) console.log('scrollTo: Clicked element didn\' have hash in href');
				return false;
			}

			$scrollTarget = $(this.hash);

			// Check if target element exists
			if ($scrollTarget.length > 0) {

				offsetTop	= $scrollTarget.offset().top;
				scrolled	= $(window).scrollTop();
				diff		= Math.sqrt(Math.abs(offsetTop - scrolled)) * config.speed;

				$document.on(scrollBreakEvents, function() {
					$htmlAndBody.stop();
					$document.off(scrollBreakEvents);
					if (config.debug) console.log('scrollTo: Scrolling stopped by breaking event');
				});

				$htmlAndBody.stop().animate(
					{scrollTop: offsetTop},
					diff,
					function() {
						$document.off(scrollBreakEvents);
					});

				window.history.pushState(null, null, this.href);

				if (config.debug) console.log('scrollTo: Scrolled to ' + this.hash + ', placed at pos: ' + offsetTop + 'px, which took: ' + diff + 's');
			}

			else if (config.debug) console.log('scrollTo: Element ' + this.hash + ' not found');
		});

		return _self;

	};

})(jQuery);