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

window.plon.MenuMobile = function(toggleElem, options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * DEFINITIONS
	 */

	// Default configuration
	var defaults = {
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
	var $document = $(document);
	var $window   = $(window);
	var $body     = $('body');

	// Common variables definition
	this.config;
	this.useHistory = false;
	this.$toggle;
	this.$menu;


	/** ----------------------------------------------------------------------------
	 * METHOD : Add Open Menu Monitoring
	 */

	this.handleClickMonitoring = (event) => {
		var $target = $(event.target);

		// Close menu if clicked element is a menu link
		if (this.config.closeByClickingMenuLink && $target.is(this.$menu.find('a'))) {
			if (this.config.debug) {
				console.info('[PLON / MenuMobile] Menu link clicked');
			}
			this.closeMenu();
		}

		// Close menu if clicked outside menu object
		else if (this.config.closeByClickingOutside && $target.closest(this.$menu).length === 0) {
			event.preventDefault();
			if (this.config.debug) {
				console.info('[PLON / MenuMobile] Clicked outside opened menu');
			}
			this.closeMenu();
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Open Menu
	 */

	this.openMenu = () => {
		if (this.config.debug) {
			console.info('[PLON / MenuMobile] Open');
		}

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
			$body.addClass(this.config.classNames.openBody);
		}

		// Handle clicking on menu link or outside opened menu
		if (this.$menu) {
			this.$menu.attr('aria-hidden', false);

			// Set small timeout to prevent click event bubbling
			setTimeout(
				() => $document.on('click.plon.menumobile', this.handleClickMonitoring),
				100
			);
		}

		// Add ability to use history back to close popup
		if (this.useHistory) {
			window.history.pushState({type: 'menumobile'}, null, null);
			$window.on('popstate.plon.menumobile', (event) => {
				event.preventDefault();
				if (this.config.debug) {
					console.info('[PLON / MenuMobile] History change event triggered while menu was open');
				}
				this.closeMenu(false);
			});
		}

		// Handle escape key to close opened navigation menu
		$document.on('keyup.plon.menumobile', (event) => {
			if (event.which === 27) {
				if (this.config.debug) {
					console.info('[PLON / MenuMobile] Escape key pressed');
				}
				this.toggleMenu();
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Close Menu
	 */

	this.closeMenu = () => {
		if (this.config.debug) {
			console.info('[PLON / MenuMobile] Close');
		}

		// Set data information about changed menu state
		this.$toggle.data(this.config.openDataName, false);

		if (this.config.classNames.openElem) {
			this.$toggle.add(this.$menu).removeClass(this.config.classNames.openElem);
		}

		if (this.config.classNames.openBody) {
			$body.removeClass(this.config.classNames.openBody);
		}

		if (this.$menu) {
			this.$menu.attr('aria-hidden', true);
		}

		// Turn off ALL events monitoring (clicking outside menu, history back, escape key)
		$window.add($document).add($body).off('.plon.menumobile');

		// Remove history state that was added during menu opening
		if (this.useHistory && arguments[0] !== false) {
			history.back();
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Toggle
	 */

	this.toggleMenu = () => {
		(this.$toggle.data(this.config.openDataName) === true)
			? this.closeMenu()
			: this.openMenu();
	};


	/** ----------------------------------------------------------------------------
	 * Initiate script - check passed options, etc.
	 */

	this.init = () => {
		this.config = { ...defaults, ...options };

		this.$toggle = $(toggleElem);

		// Check if toggle element exits in document
		if (this.$toggle.length < 1) {
			if (this.config.debug) {
				console.error('[PLON / MenuMobile] Selected toggle element does not exists - ' + this.config.toggleElem);
			}
			return false;
		}

		// Check if menu element was defined and if it exists in DOM
		if (this.config.menuElem) {
			this.$menu = $(this.config.menuElem);
			if (!this.$menu.length) {
				if (this.config.debug) {
					console.warn('[PLON / MenuMobile] Selected menu object does not exit - ' + this.config.menuElem);
				}
				this.$menu = null;
			}
		}

		// Handle toggle element click
		this.$toggle.on('click.plon.menumobile', (event) => {
			event.preventDefault();
			this.toggleMenu();
		});

		this.useHistory = (this.config.closeByClickingBack && window.history && window.history.pushState);

		if (this.config.debug) {
			console.info('[PLON / MenuMobile] Initiated.');
		}

		return this;
	};

	return this.init();
};