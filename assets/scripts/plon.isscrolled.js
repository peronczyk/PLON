/**
 * =================================================================================
 *
 * PLON Component : IsScrolled
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-04-23
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.IsScrolled = class {

	/** ----------------------------------------------------------------------------
	 * Constructor
	 * @param {Object} options
	 */

	constructor(options) {
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * DOM element that will be monitored for scroll events.
			 * @var {String|Object}
			 */
			monitoredElement: window,

			/**
			 * Which DOM element will get scrolled class name.
			 * @var {String}
			 */
			classChangeTarget: 'body',

			/**
			 * CSS class name added after reaching scrollRange.
			 * @var {String}
			 */
			scrolledClassName: 'is-Scrolled',

			/**
			 * CSS class name added when user scrolls up.
			 * @var {String}
			 */
			scrollingTopClassName: 'is-ScrollingUp',

			/**
			 * After how many pixels class name will be changed.
			 * @var {Number}
			 */
			scrollRange: 10,

			/**
			 * Debounce delay in miliseconds.
			 * @var {Number}
			 */
			debounceTime: 200,
		};

		this.config = { ...defaults, ...options };
		this.lastStatus = 0; // 1 - scrolled, 0 - not scrolled
		this.$monitoredElement;
		this.$classChangeTarget;
		this.$monitoredElement = $(this.config.monitoredElement);
		this.previousScrollY = 0;


		if (!this.$monitoredElement.length) {
			this.debugLog('Monitored element could not be found.', 'warn');
			return;
		}

		this.$classChangeTarget = $(this.config.classChangeTarget);

		if (this.$classChangeTarget.length < 1) {
			this.debugLog('Class change target could not be found.', 'warn');
			return;
		}

		this.debugLog('Initiated.', 'info');

		this.$monitoredElement.on('scroll.plon.isscrolled', this.debounce(this.checkScroll));

		this.checkScroll();
	}


	/** ----------------------------------------------------------------------------
	 * Check if element was scrolled
	 */

	checkScroll() {
		let currentScrollY = this.$monitoredElement.scrollTop();
		let isScrollingUp = (currentScrollY < this.previousScrollY);

		if (currentScrollY > 10) {
			if (this.lastStatus === 0) {
				this.$classChangeTarget.addClass(this.config.scrolledClassName);
				this.lastStatus = 1;
				this.debugLog('Element scrolled.');
			}
		}
		else {
			this.$classChangeTarget.removeClass(this.config.scrolledClassName);
			this.lastStatus = 0;
			this.debugLog('Element not scrolled.');
		}

		this.$classChangeTarget.toggleClass(this.config.scrollingTopClassName, isScrollingUp);

		this.previousScrollY = currentScrollY;
	}


	/** ----------------------------------------------------------------------------
	 * Timeout debounce
	 * @param {Function} callback
	 * @returns {Function}
	 */

	debounce(callback) {
		let timeout;

		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(callback.bind(this), this.config.debounceTime);
		};
	}


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / IsScrolled]', message);
		}
	}
};