/**
 * =================================================================================
 *
 * PLON Component : ScrollParallax
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
			dataSelector: 'data-parallax',
			defaultSpeed: 0.7,
			eventsNamespace: '.plon.scrollparallax',
		},
		$document 		= $(document),
		frameRequested	= false,
		offset, speed;


	/** ----------------------------------------------------------------------------
	 * ADJUST PARALLAX LAYERS
	 */

	function paralaxAdjust(config, layers) {
		for (var n = 0 ; n < layers.length ; n++) {
			offset = $document.scrollTop() * layers[n].speed;
			layers[n].obj.css({transform: 'translate3d(0,' + offset + 'px,0)'});
		}
	}


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.scrollParallax = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		// Definitions
		var layers = [],
			_self = $('[' + config.dataSelector + ']'),
			elem,
			layersCount = 0;

		if (config.debug) console.info('Plugin loaded: scrollParallax');

		// Create array of layers
		_self.each(function(index) {
			elem = $(this);
			speed = elem.attr(config.dataSelector);

			layers[index] = {
				'obj'	: elem,
				'speed'	: (speed) ? parseFloat(speed) : config.defaultSpeed,
			}
			layersCount++;
		});

		if (console.debug) console.info('scrollParallax: layers found - ' + layersCount);

		paralaxAdjust(config, layers);

		// Monitor document scrolling
		$(window).on('scroll' + config.eventsNamespace, function() {
			if (frameRequested) return;
			frameRequested = true;
			requestAnimationFrame(function() {
				paralaxAdjust(config, layers);
				frameRequested = false;
			});
		});
	}

})(jQuery);