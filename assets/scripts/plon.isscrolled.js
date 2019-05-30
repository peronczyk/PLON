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

window.plon.IsScrolled = class IsScrolled {

	/** ----------------------------------------------------------------------------
	 * Constructor
	 * @param {Object} options
	 */

	constructor(options) {
		const defaults = {
			debug             : false,
			monitoredElement  : window,
			classChangeTarget : 'body', // Which DOM element will get scrolled class name
			scrolledClassName : 'is-Scrolled', // CSS class name added after reaching scrollRange
			scrollRange       : 10, // After how many pixels class name will be changed
			debounceTime      : 200 // Miliseconds
		};

		this.config = { ...defaults, ...options };
		this.lastStatus = 0; // 1 - scrolled, 0 - not scrolled
		this.$monitoredElement;
		this.$classChangeTarget;
		this.$monitoredElement = $(this.config.monitoredElement);


		if (!this.$monitoredElement.length) {
			this.debugLog('Monitored element could not be found.', 'warn');
			return this;
		}

		this.$classChangeTarget = $(this.config.classChangeTarget);

		if (this.$classChangeTarget.length < 1) {
			this.debugLog('Class change target could not be found.', 'warn');
			return this;
		}

		this.$monitoredElement.on('scroll.plon.isscrolled', this.debounce(this.checkScroll));

		this.checkScroll();

		this.debugLog('Initiated.', 'info');
	}


	/** ----------------------------------------------------------------------------
	 * Check if element was scrolled
	 */

	checkScroll() {
		if (this.$monitoredElement.scrollTop() > 10) {
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