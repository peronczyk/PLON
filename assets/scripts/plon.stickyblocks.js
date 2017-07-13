
/*	================================================================================
 *
 *	JQ: STICKY BLOCKS
 *
 *	Script author	: Bartosz Perończyk (peronczyk.com)
 *	Created			: 2016-02-25
 *	Modified		: 2016-11-07
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Fixes selected elements when they reach top of the viewport
 *	Works for normal block elements and table headers (thead)
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	Example: $('.is-sticky').stickyBlocks();
 *
 *	--------------------------------------------------------------------------------
 *	TODO:
 *
 *	- Stop sticky when table ends
 *	- Stop sticky when another element overlaps previous
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug	: 0,
		},
		$window		= $(window),
		$document	= $(document),
		blocks		= [], // Collects sticky elements and it's params
		scrollTop,


	/*	----------------------------------------------------------------------------
	 *	METHODS
	 */

		// Metod fired each time user scrolls

		onScroll = function() {
			for(var i = 0; i < blocks.length; i++) {
				scrollTop = $window.scrollTop();

				// If block reached top of the screen

				if (blocks[i].elem.offset().top - scrollTop <= 0) {

					// Create fixed block by cloning origin

					if (!blocks[i].clone) {
						blocks[i].clone = blocks[i].elem.clone();
						blocks[i].clone
							.insertAfter(blocks[i].elem)
							.addClass('sticky-clone sticky-clone-' + i)
							.css({'position': 'fixed', 'top': 0, 'width': blocks[i].width});

						if (blocks[i].columns) {
							blocks[i].clone.find('th').each(function(j) {
								$(this).css({'width': blocks[i].columns[j].width}); // Set widths to cloned columns
							});
						}
					}
					else blocks[i].clone.css({'visibility': 'visible'});

					blocks[i].elem.css({'visibility': 'hidden'});
					blocks[i].fixed = true;
				}

				// If block didn't reach top of the screen but previously did

				else if (blocks[i].fixed === true) {
					blocks[i].elem.css({'visibility': 'visible'});
					blocks[i].clone.css({'visibility': 'hidden'});
					blocks[i].fixed = false;
				}
			};
		},


		// Method fired each time viewport size changes

		onResize = function() {
			var outerWidth;
			for(var i = 0; i < blocks.length; i++) {
				outerWidth = blocks[i].elem.outerWidth();
				blocks[i].width = outerWidth;
				if (blocks[i].clone) blocks[i].clone.css({'width': outerWidth + 'px'});

				// If element has columns

				if (blocks[i].columns) {
					blocks[i].elem.find('th').each(function(j) {
						blocks[i].columns[j].width = $(this).outerWidth();
					});
					if (blocks[i].clone) {
						blocks[i].clone.find('th').each(function(j) {
							$(this).css({'width': blocks[i].columns[j].width});
						});
					}
				}
			}
		},


		// Method fired once when script is loaded
		// Collects all sticky elements and sets their params in memory

		init = function() {

			if ($(this).length > 0) {
				$(this).each(function(i) {

					// Set up block's basic params

					blocks[i] = {
						'elem'	: $(this),
						'width'	: $(this).outerWidth(),
					};

					// If sticky element is a table header get widths of all of it's columns

					if (blocks[i].elem.prop('nodeName') == 'THEAD') {
						blocks[i].columns = [];
						blocks[i].elem.find('th').each(function(j) {
							blocks[i].columns[j] = {
								'elem'	: $(this),
								'width'	: $(this).outerWidth()
							};
						});
					}
				});

				$document.on('scroll', function() { window.requestAnimationFrame(onScroll); });
				$window.on('resize', function() { requestAnimationFrame(onResize); });

				return $(this);
			}
			else if (config.debug) console.error('jQ.StickyBlocks: no sticky elements selected');
		};


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.stickyBlocks = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options);

		if (config.debug) console.info('Plugin loaded: stickyBlocks');

		init.apply(this, config);

		return $(this);
	}

})(jQuery);