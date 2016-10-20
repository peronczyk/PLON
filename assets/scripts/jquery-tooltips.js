
/*	================================================================================
 *
 *	JQ: TOOLTIP
 *
 *	Script author: Bartosz Perończyk (peronczyk.com)
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Simple tooltipt, that pops out after hovering specified element.
 *	Content of the tooltip is taken from 'title' attribute.
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	$(element).tooltip();
 *	Sample JS:		$('[data-tooltip]').tooltip({'debug': 1});
 *	Sample HTML:	<a title="Some description" data-tooltip>Some text</a>
 *
 *	--------------------------------------------------------------------------------
 *	TODO:
 *
 *		- Additional params alowing to display wider tooltips (data-tooltip="wide")
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			'debug'			: 0,
			'tooltipID'		: 'tooltip', // CSS ID of tooltip DOM element
			'openClassName'	: 'is-Open', // CSS class that indicates open state
		},
		offset, text, $hoveredElem;


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.toolTips = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self		= $(this),
			$tooltip	= $('#' + config.tooltipID),
			$inner		= $tooltip.children();

		if (config.debug) console.info('Plugin loaded: toolTips');

		// If tooltip DIV wasn't found in DOM
		if ($tooltip.length < 1) {
			var $tooltip	= $('<div/>', {
					'id'			: config.tooltipID,
					'class'			: 'c-Tooltip',
					'role'			: 'tooltip',
					'aria-hidden'	: 'true'
				}),
				$inner		= $('<div/>').appendTo($tooltip);

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
			.unbind('.sl.tooltip') // Prevent double binding
			.on('mouseenter.sl.tooltip mouseleave.sl.tooltip', function(event) {

				$hoveredElem = $(this);

				switch(event.type) {

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
									'top'	: offset.top,
									'left'	: offset.left + ($hoveredElem.width() / 2)
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
	}

})(jQuery);