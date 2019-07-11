/**
 * =================================================================================
 *
 * PLON Component : Reveal
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */


window.plon = window.plon || {};

window.plon.Reveal = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @param {String} linksSelector
	 * @param {Object} options
	 */

	constructor(options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the broowser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * data-xxx selector that defines class name to be added to the element,
			 * eg.: data-reveal="js-Reveal--left"
			 */
			selector: 'data-reveal',

			// Class name added to all elements that will be revealed
			defaultClassName: 'js-Reveal',

			// Class name thar turns CSS animations off
			noTransitionClassName: 'u-NoTransition',

			// How many pixels need to be scrolled after element will show
			diff: 300,

			// Events namespace
			eventsNamespace: '.plon.reveal',
		};

		this.config = { ...defaults, ...options };
		this.$document = $(document);

		this.$elements = $('[' + this.config.selector + ']');

		if (this.$elements.length < 1) {
			this.debugLog(`No elements found to reveal with selector: [${config.reveal}]`, 'warn');
			return;
		}

		this.debugLog(`Initiated. Elements found: ${this.$elements.length}`);

		// Monitor document scrolling
		$document.on(
			'scroll' + config.eventsNamespace,
			this.rafDebounce(this.checkElementsToReveal)
		);
	};



	prepareRevealElementsInfo() {

	}


	/** ----------------------------------------------------------------------------
	 * Check each monitored element if it should be revealed.
	 */

	checkElementsToReveal() {

		// If array of elements to be animated is not empty check their distance from top
		if (elementsToReveal.length > 0) {
			for (i = 0; i < elementsToReveal.length; i++) {
				if (!elementsToReveal[i]) {
					continue; // Skip empty elements
				}

				// Change CSS classes if viewport reached this element
				if (elementsToReveal[i].fromTop < ($document.scrollTop() + window.innerHeight - config.diff)) {
					elementsToReveal[i].object
						.removeClass(this.config.noTransitionClassName)
						.removeClass(elementsToReveal[i].className);

						this.debugLog(`Element ${elementsToReveal[i].num} shown`);

					elementsToReveal.splice(i, 1); // Remove animated element from array
				}
			}
		}

		// Turn of scroll monitoring if all elements was animated
		else {
			$document.off(this.config.eventsNamespace);
		}
	};


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	setupJqueryPlugin() {
		$.reveal = () => {

			// Building array of all elements that needs to be animated
			_self.each((num, elem) => {
				let $currentElement = $(elem);
				let offset = $currentElement.offset();

				// Ignore this element if it's visible in actual viewport
				if (
					(offset.top + this.config.diff) < (window.pageYOffset + window.innerHeight) &&
					(offset.top + $currentElement.outerHeight() - this.config.diff) > window.pageYOffset
				) {
					this.debugLog(`Element [${num}] ignored because it is already in viewport.`);
					return;
				}

				elementsToReveal[num] = {
					num,
					object: $currentElement,
					className: $currentElement.attr(this.config.selector),
					fromTop: offset.top
				};

				$currentElement
					.addClass(this.config.noTransitionClassName)
					.addClass(elementsToReveal[num].className)
					.addClass(this.config.defaultClassName);

				this.debugLog(`Element [${num}] found, class name - ${elementsToReveal[num].className}, ${elementsToReveal[num].fromTop}px from top.`);
			});

			return _self;
		};
	};


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
	};


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'info') {
		if (this.config.debug) {
			console[type]('[PLON / Reveal]', message);
		}
	};

};