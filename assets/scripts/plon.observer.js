/**
 * =================================================================================
 *
 * PLON Component : Observer
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-06-04
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.IsScrolled = class {

	/** ----------------------------------------------------------------------------
	 * Constructor
	 * @param {String} observedElem
	 * @param {Callable} callback - will be fired when change is detected.
	 * @param {Object} options
	 */

	constructor(observedElem, callback, options) {
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			observeChildList: true,
			observeCharacterData: true,
			observeAttributes: true,
			observeSubtree: true,
		};

		this.allowedParams = ['childList', 'characterData', 'attributes', 'subtree'];
		this.config = { ...defaults, ...options };
		this.$observed = $(observedElem);
		this.callback = callback;

		this.debugLog(`Initiated.`, 'info');

		// Skip if function was initiated bad way
		if (callback && typeof config.init !== 'function') {
			this.debugLog(`variable passed as first argument was not a function.`);
			return;
		}

		// Skip if no dom elements was passed to watch
		else if (this.$observed.length < 1) {
			this.debugLog(`there is no elements to observe.`, 'error');
			return;
		}

		this.myObserver = new MutationObserver(this.mutationHandler); // Mutation observer object

		// Add observer to all elements
		let observerParams = this.setUpObserverParams();
		this.$observed.each((elem) => {
			this.debugLog(`Set to watch`, 'info');
			this.myObserver.observe(elem, observerParams);
		});
	};


	/** ----------------------------------------------------------------------------
	 * Mutation handler
	 * @param {Array} mutationRecords
	 */

	mutationHandler(mutationRecords) {
		mutationRecords.forEach((mutation) => {
			this.debugLog(`Change in observed area detected.`, 'info');
			let initObj = this.callback.call(initObj, mutation);
		});
	}


	/** ----------------------------------------------------------------------------
	 *
	 */

	setUpObserverParams() {
		return {
			childList: this.config.observeChildList,
			characterData: this.config.observeCharacterData,
			attributes: this.config.observeAttributes,
			subtree: this.config.observeSubtree
		};
	}


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / Observer]', message);
		}
	}

};