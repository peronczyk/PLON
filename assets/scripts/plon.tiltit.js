/**
 * =================================================================================
 *
 * PLON Component : TiltIt
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-06-05
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug		: 0,
			canvas		: $(window),
			strength	: 20,
			scale		: 1.2,
			perspective	: 600,
		},

		// Other definitions
		frameRequested	= false,
		canvasChanged	= false,
		offsetX, offsetY, canvasWidth, canvasHeight, cursorPos;


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.tiltIt = function(options) {

		// Default settings
		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self = $(this),

			// Method fired on windows resize
			onResize = function() {
				canvasWidth		= config.canvas.width();
				canvasHeight	= config.canvas.height();
			};

		if (config.debug) console.info('Plugin loaded: tiltIt');

		if (options.canvas) canvasChanged = true;

		if (_self.length < 1) {
			if (config.debug) console.log('tiltIt: no elements selected');
			return _self;
		}

		_self.css({transform: 'scale(' + config.scale + ')'}); // Set default scale transform

		// React on mouse move
		config.canvas.on('mousemove.tiltit', function(e) {

			if (frameRequested) return;
			frameRequested = true;

			requestAnimationFrame(function() {

				// Decide what mouse position should be taken to transformation calculations
				(!canvasChanged) ? cursorPos = {x: e.clientX, y: e.clientY} : cursorPos = {x: e.offsetX, y: e.offsetY} ;

				// Calculate offsets
				offsetX = -((canvasWidth / 2) - cursorPos.x) / canvasWidth * config.strength;
				offsetY = ((canvasHeight / 2) - cursorPos.y) / canvasHeight * config.strength;

				// Set transformations to tilted element
				_self.css({transform: 'scale(' + config.scale + ') perspective(' + config.perspective + 'px) translate3d(0px, 0px, 0px) rotate3d(1, 0, 0, ' + offsetY + 'deg) rotate3d(0, 1, 0, ' + offsetX + 'deg)'}
				);

				frameRequested = false;
			});
		});

		$(window).on('resize.tiltit', onResize);
		onResize.call();

		return _self;
	}

})(jQuery);