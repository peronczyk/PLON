
/*	================================================================================
 *
 *	JQ: GALLERY SLIDER
 *
 *	Author			: Bartosz Perończyk
 *	Created			: 2014-10-16
 *	Modified		: 2016-09-26
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *
 *
 *	================================================================================ */


(function($) {

	'use strict';


	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			'debug'			: 0,
			'classNames'	: {
				'imageList'		: 'o_gallery-slider__list',
				'prev'			: 'o_gallery-slider__prev',
				'next'			: 'o_gallery-slider__next'
			}
		},
		dir;


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.gallerySlider = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self = $(this);

		if (config.debug) console.info('Plugin loaded: gallerySlider');

		_self.on('click.galleryslider', '.' + config.classNames.prev + ', .' + config.classNames.next, function() {

			var $clickedElem = $(this);

			// Set direction
			dir = ($clickedElem.hasClass(config.classNames.prev)) ? 0 : 1;

			// Definitions
			var $container		= $clickedElem.parent(),
				$imageList		= $container.find('.' + config.classNames.imageList),
				$figures		= $imageList.find('figure'),
				leftOffset		= $container.offset().left,
				activeFigure;

			if ($figures.length < 1) {
				console.info('gallerySlider: Selected gallery dont\'t have any figures');
				return;
			}

			// Find number of active figure
			// It is the one that left edge is closest to left edge of container
			var diff;
			$figures.each(function(n) {
				if (n == 0 || Math.abs($(this).offset().left - leftOffset) < diff) {
					activeFigure = n;
					diff = Math.abs($(this).offset().left - leftOffset);
				}
			});
			if (config.debug) console.log('gallerySlider: Navigation clicked\n - direction: ' + dir + '\n - active image is: ' + activeFigure);

			// Calculations
			var figureWidth			= $figures[0].clientWidth, // Needs to be diference between offsets of 2 figures
				actualShift 		= $imageList.offset().left - $container.offset().left,
				visible$figures		= Math.round($imageList.width() / figureWidth); // How many images are visible on screen


			// Move $figures to right
			if (dir == 0) {
				if (activeFigure == 0) {
					if (config.debug) console.log('gallerySlider: Reached left end, rewind');
				}
				else {
					$imageList.css({'transform': 'translateX(' + ((-activeFigure + 1) * figureWidth) + 'px)'});
					if (config.debug) console.log('gallerySlider: Move elements left');
				}
			}

			// Move $figures to left
			else {
				if (activeFigure >= $figures.length - visible$figures) {
					console.log('Right end, rewind');
					$imageList.css({'transform': 'translateX(' + (-($figures.length - visible$figures) * figureWidth) + 'px)'});
				}
				else $imageList.css({'transform': 'translateX(' + ((-activeFigure - 1) * figureWidth) + 'px)'});
			}

			return false;
		});
	}

})(jQuery);