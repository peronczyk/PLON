/**
 * =================================================================================
 *
 * PLON Component : ToolTips
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-03-19
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.ToolTips = function(refs, options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * PLUGIN DEFAULT CONFIGURATION
	 */

	const defaults = {
		debug           : false,
		tooltipElem     : '#tooltip', // CSS selector of tooltip DOM element
		classNames      : {
			open: 'is-Open', // CSS class that indicates open state
		},
		eventsNamespace : '.plon.tooltips',
	};

	this.config;
	this.$refs;
	this.$tooltip;
	this.$inner;

	this.handleHover = (event) => {
		let $hoveredElem = $(event.target);
		let text, offset;

		switch (event.type) {

			// Cursor hovers element
			case 'mouseenter':
				text = $hoveredElem.attr('title') || false;

				if (text && text.length) {
					offset = $hoveredElem.offset();

					this.$inner
						.empty()
						.append(text);

					this.$tooltip
						.addClass(this.config.classNames.open)
						.attr('aria-hidden', 'false')
						.css({
							top  : offset.top,
							left : offset.left + ($hoveredElem.width() / 2)
						});

					if (this.config.debug) {
						console.info('[PLON / ToolTips] Element hovered - open tooltip.');
					}
				}
				else if (this.config.debug) {
					console.log('[PLON / ToolTips] Element hovered but do not have title text.');
				}
				break;

			// Cursor leaves element
			case 'mouseleave':
				if (this.config.debug) {
					console.info('[PLON / ToolTips] Closing tooltip.');
				}

				this.$tooltip
					.removeClass(this.config.classNames.open)
					.attr('aria-hidden', 'true');

				break;
		}
	};


	/** ----------------------------------------------------------------------------
	 * Initiate plugin
	 */

	this.init = () => {

		// Setup configuration
		this.config = Object.assign({}, defaults, options);

		// Definitions
		this.$tooltip = $('#' + this.config.tooltipID);
		this.$inner   = this.$tooltip.children();
		this.$refs    = $(refs);

		if (!this.$refs.length) {
			if (this.config.debug) {
				console.warn('[PLON / ToolTips] There is no elements that can show tooltip in current document.');
			}
			return false;
		}

		// If tooltip DIV wasn't found in DOM
		if (!this.$tooltip.length) {
			this.$tooltip = $('<div/>', {
				id				: this.config.tooltipID,
				class			: 'c-Tooltip',
				role			: 'tooltip',
				'aria-hidden'	: 'true'
			});
			this.$inner = $('<div/>').appendTo(this.$tooltip);

			$('body').append(this.$tooltip); // Add tooltip code to body
			if (this.config.debug) {
				console.info('[PLON / ToolTips] div#tooltip and inner div added to body');
			}
		}

		// If inner DIV of tooltip wasn't found in DOM
		if (this.$inner.length < 1) {
			this.$inner = $('<div/>').appendTo(this.$tooltip);
			if (this.config.debug) {
				console.info('[PLON / ToolTips] inner div added to div#tooltip');
			}
		}

		// React on mouse events
		this.$refs
			.unbind(this.config.eventsNamespace) // Prevent double binding
			.on(
				'mouseenter' + this.config.eventsNamespace + ' mouseleave' + this.config.eventsNamespace,
				this.handleHover
			);

		if (this.config.debug) {
			console.info('[PLON / ToolTips] Initiated.');
		}

		return this;
	};

	return this.init();
};