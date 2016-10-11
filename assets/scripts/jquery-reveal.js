
/*	================================================================================
 *
 *	JQ: REVEAL
 *
 *	Script author	: Bartosz Perończyk (peronczyk.com)
 *	Created			: 2016-03-23
 *	Modified		: 2016-10-11
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Script allows you to animate elements on website when you scroll to them.
 *	It adds class names specified with data-xxx tag to element when page
 *	loads and then removes it when page scrolls to it.
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	To animate element you need to do 3 things:
 *		1.	Add data-reveal="your-class-name" to HTML element you want to work with.
 *		2.	Setup script this way:
 *			$.reveal();
 *		3.	Add supporting CSS classes.
 *			.u_no-transition - disables animation when blocks are hidden after
 *				page was loaded. Class name can be changed in configuration.
 *			.your-class-name - class that hides your element.
 *
 *	--------------------------------------------------------------------------------
 *	TODO
 *
 *		- Add multiple classes to one element
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			// Debug mode
			'debug': 0,

			// data-xxx selector that defines class name to be added to the element,
			// eg.: data-reveal="js_reveal-left"
			'selector': 'data-reveal',

			// Class name added to all elements that will be revealed
			'defaultClassName': 'js_reveal',

			// Class name turning CSS animations off
			'noTransitionClassName': 'u_no-transition',

			// How many pixels need to be scrolled after element will show
			'diff': 300,
		},
		$document		= $(document),
		$window			= $(window),
		frameRequested	= false,

		currentElement, elementsToReveal = [], i, offset, height;


	/*	----------------------------------------------------------------------------
	 *	MONITOR REVEAL ELEMENTS DISTANCE FROM TOP
	 */

	function checkElementsToReveal(config) {

		// If array of elements to be animated is not empty check their distance from top
		if (elementsToReveal.length > 0) {
			for(i = 0; i < elementsToReveal.length; i++) {
				if (!elementsToReveal[i]) continue; // Skip empty elements

				// Change CSS classes if viewport reached this element
				if (elementsToReveal[i].fromTop < ($document.scrollTop() + window.innerHeight - config.diff)) {
					elementsToReveal[i].object
						.removeClass(config.noTransitionClassName)
						.removeClass(elementsToReveal[i].className);

					if (config.debug) console.info('Reveal: Element ' + elementsToReveal[i].num + ' shown');

					elementsToReveal.splice(i, 1); // Remove animated element from array
				}
			}
		}

		// Turn of scroll monitoring if all elements was animated
		else $document.off('.sl.reveal');
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.reveal = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		if (!config.selector) {
			console.error('Reveal: selector not defined');
			return false;
		}

		if (config.debug) console.info('Plugin loaded: Reveal');

		var _self = $('[' + config.selector + ']');

		if (_self.length < 1) {
			if (config.debug) console.info('Reveal: No elements found to reveal with selector: [' + config.reveal + ']');
			return _self;
		}
		else if (config.debug) console.info('Reveal: ' + _self.length + ' elements found');

		// Building array of all elements that needs to be animated
		_self.each(function(i) {
			currentElement = $(this);
			offset = currentElement.offset();
			height = currentElement.height();


			// Ignore this element if it's visible in actual viewport
			if ((offset.top + config.diff) < (window.pageYOffset + window.innerHeight) && (offset.top + currentElement.outerHeight() - config.diff) > window.pageYOffset) {
				console.info('Reveal: Element [' + i + '] ignored becouse it is already in viewport');
				return;
			}

			elementsToReveal[i] = {
				'num'		: i,
				'object'	: currentElement,
				'className'	: currentElement.attr(config.selector),
				'fromTop'	: offset.top
			};

			currentElement
				.addClass(config.noTransitionClassName)
				.addClass(elementsToReveal[i].className)
				.addClass(config.defaultClassName);

			if (config.debug) console.log('Reveal: Element [' + i + '] found, class name - ' + elementsToReveal[i].className + ', ' + elementsToReveal[i].fromTop + 'px from top');
		});

		// Monitor document scrolling
		$document.on('scroll.sl.reveal', function() {
			if (frameRequested) return;
			frameRequested = true;
			requestAnimationFrame(function() {
				checkElementsToReveal(config);
				frameRequested = false;
			});
		});

		return _self;
	}

}(jQuery));