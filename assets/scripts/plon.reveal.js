/**
 * =================================================================================
 *
 * PLON Component : Reveal
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

	var defaults =
		{
			// Debug mode
			debug: 0,

			// data-xxx selector that defines class name to be added to the element,
			// eg.: data-reveal="js-Reveal--left"
			selector: 'data-reveal',

			// Class name added to all elements that will be revealed
			defaultClassName: 'js-Reveal',

			// Class name thar turns CSS animations off
			noTransitionClassName: 'u-noTransition',

			// How many pixels need to be scrolled after element will show
			diff: 300,

			eventsNamespace: '.plon.reveal',
		},
		$document		= $(document),
		frameRequested	= false,

		currentElement,
		elementsToReveal = [],
		i,
		offset,
		height;


	/** ----------------------------------------------------------------------------
	 * MONITOR REVEAL ELEMENTS DISTANCE FROM TOP
	 */

	var checkElementsToReveal = function(config) {

		// If array of elements to be animated is not empty check their distance from top
		if (elementsToReveal.length > 0) {
			for (i = 0; i < elementsToReveal.length; i++) {
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
		else $document.off(config.eventsNamespace);
	}


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
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
		$document.on('scroll' + config.eventsNamespace, function() {
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