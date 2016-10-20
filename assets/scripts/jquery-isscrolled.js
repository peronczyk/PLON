
/*	================================================================================
 *
 *	JQ: NAVBAR SCROLL RESIZE
 *
 *	Script author: Bartosz Perończyk (peronczyk.com)
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Script monitors scrolling on selected DOM element and if scroll was
 *	made adds specified class name to another DOM element. By default
 *	class name 'is-scrolled' is added to <body>
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	Default usage that monitors scrolling on whole document and adds
 *	class 'is-scrolled' to <body> :
 *	$(document).isScrolled();
 *
 *	--------------------------------------------------------------------------------
 *	TODO
 *
 *	Triggering DOM event after isScrolled detection.
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug				: 0,
			scrolledClassName	: 'is-Scrolled', // CSS class name added after reaching scrollRange
			classChangeTarget	: 'body', // Which DOM element will get scrolled class name
			scrollRange			: 10, // After how many pixels class name will be changed
			debounceTime		: 200 // Miliseconds
		},
		checkPending	= false, // For debounce purposes
		lastStatus		= 0, // 1 - scrolled, 0 - not scrolled
		$target;


	/*	----------------------------------------------------------------------------
	 *	CHECK IF ELEMENT WAS SCROLLED
	 */

	function checkScroll(config, _self, $target) {
		if (_self.scrollTop() > 10) {
			if (lastStatus == 0) {
				$target.addClass(config.scrolledClassName);
				if (config.debug) console.info('isScrolled: Element scrolled');
				lastStatus = 1;
			}
		}
		else {
			$target.removeClass(config.scrolledClassName);
			if (config.debug) console.info('isScrolled: Element not scrolled');
			lastStatus = 0;
		}
		checkPending = false;
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.isScrolled = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self = $(this);

		if (config.debug) console.info('Plugin loaded: isScrolled');

		$target = $(config.classChangeTarget);

		if ($target.length < 1) {
			if (config.debug) console.log('isScrolled: Class change target couldn\'t be found');
			return _self;
		}


		// Monitor scroll events

		_self.on('scroll.isscrolled', function() {
			if (!checkPending) {
				checkPending = true;
				setTimeout(function() { checkScroll(config, _self, $target) }, config.debounceTime);
			}
		});

		return _self;
	}

})(jQuery);