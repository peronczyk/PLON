/**
 * =================================================================================
 *
 * PLON Component : CookiesInfo
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-06-04
 * @repository		https://github.com/peronczyk/plon
 *
 *	================================================================================
 */

window.plon = window.plon || {};

window.plon.cookiesInfo = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @param {String} linksSelector
	 * @param {Object} options
	 */

	constructor(infoBoxSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the broowser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * Name of CSS class name, that makes cookies bar visible.
			 * @var {String}
			 */
			visibleClassName: 'is-Open',

			/**
			 * CSS selector for DOM element inside cookies info box,
			 * that accepts cookie law.
			 * @var {String}
			 */
			acceptButton: 'button',

			/**
			 * Local storage entry name stored in visitor's computer.
			 * @var {String}
			 */
			storageEntryName: 'plonCookiesAccepted',
		};

		this.config = { ...defaults, ...options };
		this.storageEntryAcceptValue = '1';
		this.$infoBox = $(infoBoxSelector);

		// Check if cookies bar exists in DOM
		if (this.$infoBox.length < 1) {
			this.debugLog(`Cookies info box not found.`, 'error');
			return;
		}

		this.debugLog(`Initiated.`);

		this.acceptState = (window.localStorage.getItem(this.config.storageEntryName) == this.storageEntryAcceptValue);

		(this.acceptState)
			? this.closeInfoBox()
			: this.openInfoBox();
	};


	/** ----------------------------------------------------------------------------
	 * Open info box.
	 */

	openInfoBox() {
		this.debugLog(`Cookies not accepted, open box.`);
		this.$infoBox
			.addClass(config.visibleClassName)
			.on('click', this.config.acceptButton, this.bindAcceptButton);
	};


	/** ----------------------------------------------------------------------------
	 * Close info box.
	 */

	closeInfoBox() {
		this.$infoBox
			.removeClass(config.visibleClassName)
			.off('click', this.config.acceptButton, this.bindAcceptButton);

		this.debugLog(`Cookies accepted, info box not shown.`);
	};


	/** ----------------------------------------------------------------------------
	 * Bind closing action to button.
	 * @param {Object} event
	 */

	bindAcceptButton(event) {
		event.preventDefault();
		this.debugLog(`Cookies accepted, close info box.`);
		window.localStorage.setItem(this.config.storageEntryName, this.storageEntryAcceptValue);
		this.closeInfoBox();
	}


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'info') {
		if (this.config.debug) {
			console[type]('[PLON / CookiesInfo]', message);
		}
	};

};