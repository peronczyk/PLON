
/*	================================================================================
 *
 *	MENU MOBILE COMPONENT
 *
 *	Modified		: 2017-04-04
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


window.MenuMobile = function(options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * DEFINITIONS
	 */

	var that = this;

	// Default configuration
	var defaults =
		{
			debug : 0,

			// Class name or ID of DOM toggle element (e.g. hamburger icon)
			toggleElem: null,

			// Class name or ID of DOM element that contains menu.
			// Define this only if you want to change class name of this element
			// when menu state changes.
			menuElem: null,

			// Data atribute name added to menu toggle that indicates
			// whether menu is open or closed
			openDataName: 'menumobile-open',

			// Should script toggle mobile menu when user clicks menu link.
			// Works only if `menuElem` is provided.
			closeByClickingMenuLink: false,

			// Should script toggle mobile menu when user clicks outside selected
			// menu element.
			// Works only if `menuElem` is provided
			closeByClickingOutside: true,

			// Should script close mobile menu if user uses "backspace" key
			// or triest to go back in browser history (user back arrow in browser)
			closeByClickingBack: true,

			// CSS class names (without dot at the beginning)
			classNames: {

				// CSS class added to <body> element when menu is open.
				// Set it to 'null' if you want to disable adding class to <body>.
				// Used also for disabling scroll.
				openBody: 'is-menuMobile--open',

				// CSS class added to toggle element and menu element.
				// If You don't want to add separate classes to menu and toggle
				// leave it 'null'.
				openElem: null,
			}
		};

	// Shortcuts
	var $document	= $(document),
		$window		= $(window),
		$body		= $('body');

	// Common variables definition
	var config,
		$toggle		= false,
		$menu		= false,
		useHistory	= false;


	/** ----------------------------------------------------------------------------
	 * METHOD : Add Open Menu Monitoring
	 */

	this.handleClickMonitoring = function(event) {
		var $target = $(event.target);

		// Close menu if clicked element is a menu link
		if (config.closeByClickingMenuLink && $target.is($menu.find('a'))) {
			if (config.debug) console.log('menuMobile: Menu link clicked');
			that.closeMenu();
		}

		// Close menu if clicked outside menu object
		else if (config.closeByClickingOutside && $target.closest($menu).length === 0) {
			event.preventDefault();
			if (config.debug) console.log('menuMobile: Clicked outside opened menu');
			that.closeMenu();
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Open Menu
	 */

	this.openMenu = function() {
		if (config.debug) console.log('menuMobile: Open');

		// Set data information about changed menu state
		$toggle.data(config.openDataName, true);

		// Add active classes to toggle and menu elemens
		if (config.classNames.openElem) {
			$toggle.addClass(config.classNames.openElem);
			if ($menu) $menu.addClass(config.classNames.openElem);
		}

		if (config.classNames.openBody) $body.addClass(config.classNames.openBody);

		// Handle clicking on menu link or outside opened menu
		if ($menu) {
			$menu.attr('aria-hidden', false);

			// Set small timeout to prevent click event bubbling
			setTimeout(
				function() {
					$document.on('click.plon.menumobile', that.handleClickMonitoring);
				},
				100
			);
		}

		// Add ability to use history back to close popup
		if (useHistory) {
			window.history.pushState({type: 'menumobile'}, null, null);
			$window.on('popstate.plon.menumobile', function(event) {
				event.preventDefault();
				if (config.debug) console.log('menuMobile: History change event triggered while menu was open');
				that.closeMenu(false);
			});
		}

		// Handle escape key to close opened navigation menu
		$document.on('keyup.plon.menumobile', function(event) {
			if (event.which === 27) {
				if (config.debug) console.log('menuMobile: Escape key pressed');
				that.toggleMenu();
			}
		});
	};


	/*	----------------------------------------------------------------------------
	 *	METHOD : Close Menu
	 */

	this.closeMenu = function() {
		if (config.debug) console.log('menuMobile: Close');

		// Set data information about changed menu state
		$toggle.data(config.openDataName, false);

		if (config.classNames.openElem) {
			$toggle.add($menu).removeClass(config.classNames.openElem);
		}

		if (config.classNames.openBody) {
			$body.removeClass(config.classNames.openBody);
		}

		if ($menu) $menu.attr('aria-hidden', true);

		// Turn off ALL events monitoring (clicking outside menu, history back, escape key)
		$window.add($document).add($body).off('.plon.menumobile');

		// Remove history state that was added during menu opening
		if (useHistory && arguments[0] !== false) history.back();
	};


	/*	----------------------------------------------------------------------------
	 *	METHOD : Toggle
	 */

	this.toggleMenu = function() {
		if ($toggle.data(config.openDataName) === true) {
			that.closeMenu();
		}
		else {
			that.openMenu();
		}
	};


	/*	----------------------------------------------------------------------------
	 *	METHOD : Init
	 */

	this.init = function() {
		config = $.extend({}, defaults, options);

		$toggle = $(config.toggleElem);

		// Check if toggle element exits in document
		if ($toggle.length < 1) {
			if (config.debug) console.error('menuMobile: Selected toggle element does not exists - ' + config.toggleElem);
			return false;
		}

		// Check if menu element was defined and if it exists in DOM
		if (config.menuElem) {
			$menu = $(config.menuElem);
			if (!$menu.length) {
				if (config.debug) console.warn('menuMobile: Selected menu object does not exits - ' + config.menuElem);
				$menu = false;
			}
		}

		// Handle toggle element click
		$toggle.on('click.plon.menumobile', function() {
			event.preventDefault();
			that.toggleMenu();
		});

		useHistory = config.closeByClickingBack && window.history && window.history.pushState;

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * INITIATE COMPONENT
	 */

	if (this.init() && config.debug) console.info('[PLON] MenuMobile initiated');
};