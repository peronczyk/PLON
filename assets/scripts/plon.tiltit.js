/**
 * =================================================================================
 *
 * PLON Component : TiltIt
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-06-05
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

	constructor(elementsSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the broowser.
			 * @var {Boolean}
			 */
			debug: false,
			canvas: window,
			strength: 20,
			scale: 1.2,
			perspective: 600,
			eventsNamespace: '.plon.tiltit',
		};

		this.config = { ...defaults, ...options };
		this.$canvas = $(this.config.canvas);
		this.canvasWidth;
		this.canvasHeight;
		this.$elements = $(elementsSelector);

		if (this.$canvas.length < 1) {
			this.debugLog(`Canvas element does not exist.`, 'warn');
			return;
		}

		if (this.$elements.length < 1) {
			this.debugLog(`No elements selected.`, 'warn');
			return;
		}

		$(window).on(
			'resize' + this.config.eventsNamespace,
			this.rafDebounce(this.adjustCanvasSize)
		);
		this.adjustCanvasSize();

		// Set default scale transform
		this.$elements.css({transform: 'scale(' + this.config.scale + ')'});

		this.$canvas.on(
			'mousemove' + this.config.eventsNamespace,
			this.rafDebounce(this.adjustElementTilt)
		);
	};


	/** ----------------------------------------------------------------------------
	 * Adjust element tilt
	 */

	adjustElementTilt() {
		// Decide what mouse position should be taken to transformation calculations
		let cursorPos = (canvasChanged)
			? {x: e.offsetX, y: e.offsetY}
			: {x: e.clientX, y: e.clientY};

		// Calculate offsets
		let offsetX = -((canvasWidth / 2) - cursorPos.x) / canvasWidth * config.strength;
		let offsetY = ((canvasHeight / 2) - cursorPos.y) / canvasHeight * config.strength;

		// Set transformations to tilted element
		_self.css({transform: `scale(${config.scale}) perspective(${config.perspective}px) translate3d(0px, 0px, 0px) rotate3d(1, 0, 0, ${offsetY}deg) rotate3d(0, 1, 0, ${offsetX}deg)`}
		);
	};


	/** ----------------------------------------------------------------------------
	 * Method fired on windows resize
	 */

	adjustCanvasSize() {
		this.canvasWidth = this.$canvas.width();
		this.canvasHeight = this.$canvas.height();
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
	 */

	debugLog(message, type = 'info') {
		if (this.config.debug) {
			console[type]('[PLON / TiltIt]', message);
		}
	};

};