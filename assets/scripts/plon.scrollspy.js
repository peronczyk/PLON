/**
 * =================================================================================
 *
 * PLON Component : ScrollSpy
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-04-24
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.ScrollSpy = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @param {String} linksSelector
	 * @param {Object} options
	 */

	constructor(linksSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * @var {String}
			 */
			activeLinkClassName: 'is-Active',

			/**
			 * Decide how viewport position should be adjusted in corelation with
			 * sections.
			 * @var {Number}
			 */
			viewportShift: 0,

			/**
			 * Specify the offset which will cause delayed highlighting
			 * of subsequent sections.
			 * @var {Number}
			 */
			viewportBottomShift: -100,

			/**
			 * Decide how strong should be the scroll event debounce.
			 * @var {Number} in miliseconds.
			 */
			debounceTime: 40,

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the broowser.
			 * @var {Boolean}
			 */
			debug: false,
		};

		// Setup class properties
		this.config = { ...defaults, ...options };
		this.$window = $(window);
		this.linksCollection = [];
		this.activeLinkNumber;

		let $links = $(linksSelector).find('a');

		if (!$links.length) {
			return this.debugLog('No links found in this document.', 'warn');
		}

		this.createLinksCollection($links);

		this.$window.on('scroll', this.debounce(this.scrollActionHandler));

		this.debugLog('Initiated.', 'info');
	}


	/** ----------------------------------------------------------------------------
	 * Create array of objects based on list of links.
	 * @param {Array} $links
	 */

	createLinksCollection($links) {
		$links.each((index, link) => {
			let $link = $(link);
			let hash = $link[0].hash;
			let $section = $(hash);

			// Check if this link has section that matches its hash
			if (!$section.length) {
				return;
			}

			this.linksCollection.push({
				$link,
				$section,
				hash,
			});
		});
	}


	/** ----------------------------------------------------------------------------
	 * Scroll event handler
	 * @returns {Boolean} - highlighted or not
	 */

	scrollActionHandler() {
		let activeSection = false;
		let index = 0;
		let viewportTop = this.$window.scrollTop() - this.config.shift;
		let viewportBottom = viewportTop + this.$window.height() + this.config.viewportBottomShift;

		this.removeLinksHighlight();

		for (let entry of this.linksCollection) {
			let sectionTop = entry.$section.offset().top;
			let sectionBottom = sectionTop + entry.$section.outerHeight();

			// Section is fully in viewport so no other should be activated
			if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
				activeSection = index;
				break;
			}

			// Section is partially in viewport
			else if (viewportTop <= sectionTop && viewportBottom > sectionTop) {
				activeSection = index;
			}
			index++;
		}

		if (activeSection !== false) {
			this.highightLinkByIndex(activeSection);
			return true;
		}

		return false;
	}


	/** ----------------------------------------------------------------------------
	 * Highlight one of collected links by provided index.
	 * @param {Number} linkIndex
	 */

	highightLinkByIndex(linkIndex) {
		let activeEntry = this.linksCollection[linkIndex];

		// Add active class to active link
		activeEntry.$link.addClass(this.config.activeLinkClassName);

		this.debugLog(`Highlighted link: ${linkIndex}, with id: ${activeEntry.hash}.`);
	}


	/** ----------------------------------------------------------------------------
	 * Remove active class form all links
	 */

	removeLinksHighlight() {
		this.linksCollection.forEach((entry) => {
			entry.$link.removeClass(this.config.activeLinkClassName);
		});
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
			console[type]('[PLON / ScrollSpy]', message);
		}
	}
};