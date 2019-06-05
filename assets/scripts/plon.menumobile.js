/**
 * =================================================================================
 *
 * PLON Component : MenuMobile
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-03-19
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.MenuMobile = class {

	/** ----------------------------------------------------------------------------
	 * Constructor
	 * @param {String} toggleElem - CSS selector for element that will open or close
	 *   the menu by chenging body class.
	 * @param {Object} options
	 */

	constructor(toggleElem, options) {
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * Class name or ID of DOM element that contains menu.
			 * Define this only if you want to change class name of this element
			 * when menu state changes.
			 */
			menuElem: null,

			/**
			 * Data atribute name added to menu toggle that indicates
			 * whether menu is open or closed.
			 */
			openDataName: 'menumobile-open',

			/**
			 * Should script toggle mobile menu when user clicks menu link.
			 * Works only if `menuElem` is provided.
			 */
			closeByClickingMenuLink: false,

			/**
			 * Should script toggle mobile menu when user clicks outside selected
			 * menu element. Works only if `menuElem` is provided.
			 */
			closeByClickingOutside: true,

			/**
			 * Should script close mobile menu if user uses "backspace" key
			 * or triest to go back in browser history (user back arrow in browser).
			 */
			closeByClickingBack: true,

			/**
			 * CSS class names (without dot at the beginning).
			 */
			classNames: {

				/**
				 * CSS class added to <body> element when menu is open.
				 * Set it to 'null' if you want to disable adding class to <body>.
				 * Used also for disabling scroll.
				 */
				openBody: 'is-MenuMobile--Open',

				/**
				 * CSS class added to toggle element and menu element.
				 * If You don't want to add separate classes to menu and toggle
				 * leave it 'null'.
				 */
				openElem: null,
			}
		};

		// Shortcuts
		this.$document = $(document);
		this.$window = $(window);
		this.$body = $('body');

		// Common variables definition
		this.config = { ...defaults, ...options };
		this.useHistory = (this.config.closeByClickingBack && window.history && window.history.pushState);
		this.$menu;
		this.$toggle = $(toggleElem);

		// Check if toggle element exits in document
		if (this.$toggle.length < 1) {
			this.debugLog(`Selected toggle element does not exists - ${this.config.toggleElem}`, 'error');
			return false;
		}

		// Check if menu element was defined and if it exists in DOM
		if (this.config.menuElem) {
			this.$menu = $(this.config.menuElem);
			if (!this.$menu.length) {
				this.debugLog(`Selected menu object does not exist: ${this.config.menuElem}`, 'warn');
				this.$menu = null;
			}
		}

		// Handle toggle element click
		this.$toggle.on('click.plon.menumobile', (event) => {
			event.preventDefault();
			this.toggleMenu();
		});

		this.debugLog(`Initiated.`, 'info');
	}


	/** ----------------------------------------------------------------------------
	 * Add Open Menu Monitoring
	 */

	handleClickMonitoring(event) {
		let $target = $(event.target);

		// Close menu if clicked element is a menu link
		if (this.config.closeByClickingMenuLink && $target.is(this.$menu.find('a'))) {
			this.debugLog(`Menu link clicked`, 'info');
			this.closeMenu();
		}

		// Close menu if clicked outside menu object
		else if (this.config.closeByClickingOutside && $target.closest(this.$menu).length === 0) {
			event.preventDefault();
			this.debugLog(`Clicked outside opened menu`, 'info');
			this.closeMenu();
		}
	};


	/** ----------------------------------------------------------------------------
	 * Open Menu
	 */

	openMenu() {
		this.debugLog(`Open`, 'info');

		// Set data information about changed menu state
		this.$toggle.data(this.config.openDataName, true);

		// Add active classes to toggle and menu elemens
		if (this.config.classNames.openElem) {
			this.$toggle.addClass(this.config.classNames.openElem);
			if (this.$menu) {
				this.$menu.addClass(this.config.classNames.openElem);
			}
		}

		if (this.config.classNames.openBody) {
			this.$body.addClass(this.config.classNames.openBody);
		}

		// Handle clicking on menu link or outside opened menu
		if (this.$menu) {
			this.$menu.attr('aria-hidden', false);

			// Set small timeout to prevent click event bubbling
			setTimeout(
				() => this.$document.on('click.plon.menumobile', this.handleClickMonitoring),
				100
			);
		}

		// Add ability to use history back to close popup
		if (this.useHistory) {
			window.history.pushState({type: 'menumobile'}, null, null);

			this.$window.on('popstate.plon.menumobile', (event) => {
				event.preventDefault();

				this.debugLog(`History change event triggered while menu was open`, 'info');
				this.closeMenu(false);
			});
		}

		// Handle escape key to close opened navigation menu
		this.$document.on('keyup.plon.menumobile', (event) => {
			if (event.which === 27) {
				this.debugLog(`Escape key pressed`, 'info');
				this.toggleMenu();
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * Close Menu
	 */

	closeMenu() {
		this.debugLog(`Close`);

		// Set data information about changed menu state
		this.$toggle.data(this.config.openDataName, false);

		if (this.config.classNames.openElem) {
			this.$toggle.add(this.$menu).removeClass(this.config.classNames.openElem);
		}

		if (this.config.classNames.openBody) {
			this.$body.removeClass(this.config.classNames.openBody);
		}

		if (this.$menu) {
			this.$menu.attr('aria-hidden', true);
		}

		// Turn off ALL events monitoring (clicking outside menu, history back, escape key)
		this.$window.add(this.$document).add(this.$body).off('.plon.menumobile');

		// Remove history state that was added during menu opening
		if (this.useHistory && arguments[0] !== false) {
			history.back();
		}
	};


	/** ----------------------------------------------------------------------------
	 * Toggle
	 */

	toggleMenu() {
		(this.$toggle.data(this.config.openDataName) === true)
			? this.closeMenu()
			: this.openMenu();
	};


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / MenuMobile]', message);
		}
	}
};