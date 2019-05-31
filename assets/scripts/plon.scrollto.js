/**
 * =================================================================================
 *
 * PLON Component : ScrollTo
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-04-24
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.ScrollTo = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @var {String} scrollElementSelector
	 * @var {Object} options
	 */

	constructor(scrollElementSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in conssole
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * Decide how fast page will be scrolled.
			 * @var {Boolean}
			 */
			speed: 25,

			/**
			 * Decide how far from the destination viewport should stop.
			 * @var {Number}
			 */
			shift: 0,

			/**
			 * Events that should immedietly stop smooth scrolling.
			 * @var {String}
			 */
			scrollBreakEvents: 'mousewheel.scrollto DOMMouseScroll.scrollto',

			/**
			 * Decide if hash should be added to current address after succesfull
			 * scrolling.
			 * @var {Boolean}
			 */
			useHistory: true,
		};

		this.config = { ...defaults, ...options };
		this.$links = $(scrollElementSelector).filter('a');
		this.$htmlAndBody = $('html,body');
		this.$document = $(document);

		this.$links.on('click', (event) => this.linkClickReaction(event));

		this.debugLog(`Initiated. Links found: ${this.$links.length}`, 'info');
	}


	/** ----------------------------------------------------------------------------
	 * React on click event
	 */

	linkClickReaction(event) {
		event.preventDefault();

		let $clickedElement = $(event.currentTarget)[0];

		// Stop if there is no target specified (no #element in href)
		if (!$clickedElement.hash) {
			this.debugLog('Clicked element does not have hash in href atribute.');
			return;
		}

		let $scrollTarget = $($clickedElement.hash);

		// Check if target element exists
		if (!$scrollTarget.length) {
			this.debugLog(`Element ${$clickedElement.hash} not found.`);
			return;
		}

		let offsetTop  = $scrollTarget.offset().top + this.config.shift;
		let scrolled   = $(window).scrollTop();
		let scrollTime = Math.sqrt(Math.abs(offsetTop - scrolled)) * this.config.speed;

		this.$document.on(this.config.scrollBreakEvents, () => {
			this.$htmlAndBody.stop();
			this.$document.off(this.config.scrollBreakEvents);
			this.debugLog('Scrolling stopped by breaking event');
		});

		this.$htmlAndBody.stop().animate(
			{ scrollTop: offsetTop },
			scrollTime,
			() => this.$document.off(this.config.scrollBreakEvents)
		);

		if (this.config.useHistory) {
			window.history.pushState(null, null, $clickedElement.href);
		}

		this.debugLog(`Scrolled to ${$clickedElement.hash}, placed at pos: ${offsetTop} px, which took: ${scrollTime}s.`);
	}


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / ScrollTo]', message);
		}
	}
};