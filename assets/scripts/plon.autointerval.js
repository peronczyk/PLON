/**
 * =================================================================================
 *
 * PLON Component : AutoInterval
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-03-19
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.AutoInterval = function(callbackAction, options) {
	'use strict';

	const defaults = {
		debug: false,
		delay: 3000,
		hoverPauseElem: null,
	};

	this.timer;
	this.config;
	this.$hoverPauseElem;


	/** ----------------------------------------------------------------------------
	 * Play or resume interval loop
	 */

	this.play = () => {
		this.stop();
		this.timer = setInterval(
			callbackAction,
			this.config.delay
		);
	};


	/** ----------------------------------------------------------------------------
	 * Pause interval loop
	 */

	this.stop = () => {
		clearInterval(this.timer);
	};


	/** ----------------------------------------------------------------------------
	 * Handle common events that should pause or play interval loop
	 */

	this.handleEvents = (event) => {
		switch (event.type) {
			case 'mouseenter':
				this.stop();
				break;

			case 'mouseleave':
				this.play();
				break;

			case 'visibilitychange':
				(document.hidden)
					? this.stop()
					: this.play();
				break;
		}
	};


	/** ----------------------------------------------------------------------------
	 * Initiate script - check passed options, etc.
	 */

	this.init = () => {
		this.config = { ...defaults, ...options };

		if (this.config.hoverPauseElem) {
			this.$hoverPauseElem = $(this.config.hoverPauseElem);

			if (this.$hoverPauseElem.length) {
				this.$hoverPauseElem.on('mouseenter.autointerval mouseleave.autointerval', this.handleEvents);
			}
			else {
				console.warn('[AutoInterval] Hover pause element was defined but not found in the current document');
			}
		}

		$(document).on('visibilitychange.autointerval', this.handleEvents);

		this.play();

		if (this.config.debug) {
			console.info('[PLON / AutoInterval] Initiated.');
		}

		return this;
	};

	return this.init();
};