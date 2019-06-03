/**
 * =================================================================================
 *
 * PLON Component : ScrollParallax
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-06-02
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

dow.plon = window.plon || {};

window.plon.Modal = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @var {Object} options
	 */

	constructor(layersSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,
			dataSelector: 'data-parallax',
			defaultSpeed: 0.7,
			eventsNamespace: '.plon.scrollparallax',
		};

		this.config = { ...defaults, ...options };
		this.$document = $(document);
		this.frameRequested = false;
		this.$layers = $(layersSelector);
		this.layersData = this.prepareLayersData();

		this.paralaxAdjust();

		// Monitor document scrolling
		$(window).on(
			'scroll' + config.eventsNamespace,
			this.rafDebounce(this.paralaxAdjust)
		);

		debugLog(`Initiated. Layers found: ${this.layersData.length}`);
	}


	/** ----------------------------------------------------------------------------
	 * Prepare layers data
	 * @returns {Array}
	 */

	prepareLayersData() {
		let layersData = [];

		this.$layers.each((index) => {
			let $elem = $(this);
			let speed = $elem.attr(config.dataSelector);

			layersData[index] = {
				$elem,
				speed: (speed) ? parseFloat(speed) : config.defaultSpeed,
			}
		});

		return layersData;
	}


	/** ----------------------------------------------------------------------------
	 * Adjust parallax layers position.
	 */

	paralaxAdjust() {
		for (let n = 0 ; n < this.layersData.length ; n++) {
			let { $elem, speed } = this.layersData[n];
			let offset = $elem.scrollTop() * speed;

			$elem.css({ transform: `translate3d(0, ${offset}px, 0)` });
		}
	}


	/** ----------------------------------------------------------------------------
	 * Request Animation Frame debounce
	 * @param {Function} callback
	 * @returns {Function}
	 */

	rafDebounce(callback) {
		let frameRequested = false;

		return () => {
			if (frameRequested) {
				return;
			}
			frameRequested = true;
			requestAnimationFrame(() => {
				callback();
				frameRequested = false;
			});
		}
	}


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / Modal]', message);
		}
	}
}