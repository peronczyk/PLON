/**
 * =================================================================================
 *
 * PLON Component : ToolTips
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
			debug			: 0,
			tooltipID		: 'tooltip', // CSS ID of tooltip DOM element
			openClassName	: 'is-Open', // CSS class that indicates open state
			eventsNamespace	: '.plon.tooltips',
		},
		offset, text, $hoveredElem;


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.toolTips = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		// Definitions
		var _self		= $(this),
			$tooltip	= $('#' + config.tooltipID),
			$inner		= $tooltip.children();

		if (config.debug) console.info('Plugin loaded: ToolTips');

		// If tooltip DIV wasn't found in DOM
		if ($tooltip.length < 1) {
			var $tooltip = $('<div/>', {
					id				: config.tooltipID,
					class			: 'c-Tooltip',
					role			: 'tooltip',
					'aria-hidden'	: 'true'
				}),
				$inner = $('<div/>').appendTo($tooltip);

			$('body').append($tooltip); // Add tooltip code to body
			if (config.debug) console.info('toolTip: div#tooltip and inner div added to body');
		}

		// If inner DIV of tooltip wasn't found in DOM
		if ($inner.length < 1) {
			$inner = $('<div/>').appendTo($tooltip);
			if (config.debug) console.info('toolTip: inner div added to div#tooltip');
		}

		// React on mouse events
		_self
			.unbind(config.eventsNamespace) // Prevent double binding
			.on('mouseenter' + config.eventsNamespace + ' mouseleave' + config.eventsNamespace, function(event) {

				$hoveredElem = $(this);

				switch (event.type) {

					// Cursor hovers element
					case 'mouseenter':
						text = $hoveredElem.attr('title') || false;

						if (text && text.length) {
							offset = $hoveredElem.offset();
							$inner
								.empty()
								.append(text);

							$tooltip
								.addClass(config.openClassName)
								.attr('aria-hidden', 'false')
								.css({
									top		: offset.top,
									left	: offset.left + ($hoveredElem.width() / 2)
								});

							if (config.debug) console.info('toolTip: Element hovered - open tooltip');
						}
						else if (config.debug) console.log('toolTip: Element hovered but don\'t have title text');
						break;

					// Cursor leaves element
					case 'mouseleave':

						if (config.debug) console.info('toolTip: Closing tooltip');

						$tooltip
							.removeClass(config.openClassName)
							.attr('aria-hidden', 'true');

						break;
				}
			});

		return _self;
	};

})(jQuery);