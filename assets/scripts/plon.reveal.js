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
						.removeClass(config.noTransitionClassName)
						.removeClass(elementsToReveal[i].className);

						this.debugLog(`Element ${elementsToReveal[i].num} shown`);

					elementsToReveal.splice(i, 1); // Remove animated element from array
				}
			}
		}

		// Turn of scroll monitoring if all elements was animated
		else {
			$document.off(config.eventsNamespace);
		}
	};


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.reveal = function(options) {

		// Building array of all elements that needs to be animated
		_self.each(function(i) {
			currentElement = $(this);
			offset = currentElement.offset();
			height = currentElement.height();


			// Ignore this element if it's visible in actual viewport
			if ((offset.top + config.diff) < (window.pageYOffset + window.innerHeight) && (offset.top + currentElement.outerHeight() - config.diff) > window.pageYOffset) {
				console.info('[PLON / Reveal] Element [' + i + '] ignored because it is already in viewport.');
				return;
			}

			elementsToReveal[i] = {
				num			: i,
				object		: currentElement,
				className	: currentElement.attr(config.selector),
				fromTop		: offset.top
			};

			currentElement
				.addClass(config.noTransitionClassName)
				.addClass(elementsToReveal[i].className)
				.addClass(config.defaultClassName);

			if (config.debug) console.log('[PLON / Reveal] Element [' + i + '] found, class name - ' + elementsToReveal[i].className + ', ' + elementsToReveal[i].fromTop + 'px from top');
		});



		return _self;
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