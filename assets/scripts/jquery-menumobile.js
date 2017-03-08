
/*	================================================================================
 *
 *	JQ: MENU MOBILE
 *
 *	Author			: Bartosz Perończyk
 *	Created			: 2016-05-11
 *	Modified		: 2016-07-19
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Adds mobile functionality to normal navigation menu
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	$('#menu-container').mobileMenu(
 *		'toggleElem': '#menu-toggle'
 *	});
 *
 *	#menu-toggle	- link that open or close menu
 *	#menu-container	- element, that will be shown or hide after clicking
 *					  on #menu-toggle
 *
 *	================================================================================ */


(function($) {

	'use strict';


	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			// Debug mode
			'debug' : 0,

			// Class name or ID of DOM element that contains menu.
			// Define this only if you want to change class name of this element
			// when menu state changes.
			'menuElem': null,

			// CSS class added to toggle and menu element.
			// If You don't want to add separate classes to menu and toggle
			// leave it 'null'
			'openClassName': null,

			// Data atribute name added to menu toggle that indicates
			// whether menu is open or closed
			'openDataName': 'menumobile-open',

			// CSS class added to <body> element when menu is open.
			// Set it to 'null' if you want to disable adding class to <body>.
			// Used also for disabling scroll.
			'openBodyClassName': 'is-menuMobile--open',

			// Namespace for events fired with script
			'eventsNamespace': 'menumobile',

			// Should script toggle mobile menu when user clicks outside selected
			// menu element
			'closeByClickingOutside': true,

			// Should script close mobile menu if user uses "backspace" key
			// or triest to go back in browser history (user back arrow in browser)
			'closeByClickingBack': true,
		},

		// Some shortcuts
		$document	= $(document),
		$window		= $(window),
		$body		= $('body');



	/*	----------------------------------------------------------------------------
	 *	MENU TOGGLE
	 */

	var toggleMenu = function(config) {
		var $toggle = this;

		console.log('BLA');

		// CLOSE MENU

		if ($toggle.data(config.openDataName) == true) {

			// Set data information about changed menu state
			$toggle.data(config.openDataName, false);

			if (config.debug) console.log('menuMobile: Close');

			// Remove active classes from toggle and menu elemens
			if (config.openClassName) $toggle.add($menuToggle).removeClass(config.openClassName);

			// Remove specific class from body element
			if (config.openBodyClassName) $body.removeClass(config.openBodyClassName);

			// Turn off ALL events monitoring (clicking outside menu, history back, escape key)
			$window.add(document).off('.' + config.eventsNamespace);
		}


		// OPEN MENU

		else {

			// Set data information about changed menu state
			$toggle.data(config.openDataName, true);

			if (config.debug) console.log('menuMobile: Open');

			// Add active classes to toggle and menu elemens
			if (config.openClassName) {
				$toggle.addClass(config.openClassName);
				if (config.$menu) config.$menu.addClass(config.openClassName);
			}

			// Add specific class from body element
			if (config.openBodyClassName) $body.addClass(config.openBodyClassName);

			// Handle clicking on menu link or outside opened menu
			$document.on('click.' + config.eventsNamespace, function(event) {

				// Close menu if clicked element is a menu link
				if ($(event.target).is($toggle.find('a'))) {
					if (config.debug) console.log('menuMobile: Menu link clicked');
					toggleMenu.call($toggle, config);
				}

				// Close menu if clicked outside menu object
				else if (config.closeByClickingOutside && !$(event.target).closest($toggle).length) {
					event.preventDefault();
					if (config.debug) console.log('menuMobile: Clicked outside opened menu');
					toggleMenu.call($toggle, config);
				}
			});

			// Add ability to use history back to close popup
			if (config.closeByClickingBack) {
				window.history.pushState({type: 'menumobile'}, null, null); // Set history state

				$window.on('popstate.' + config.eventsNamespace, function(event) {
					if (config.debug) console.log('menuMobile: History change event triggered while menu was open');
					toggleMenu.call($toggle, config);
				});
			}

			// Handle escape key to close opened navigation menu
			$document.on('keyup.' + config.eventsNamespace, function(event) {
				if (event.which == 27) {
					if (config.debug) console.log('menuMobile: Escape key pressed');
					toggleMenu.call($toggle, config);
				}
			});
		}
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.menuMobile = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			$toggle = this,
			$menu; // Link to menu element;

		if (config.debug) console.info('Plugin loaded: menuMobile');

		// Check if toggle element exits in document
		if ($toggle.length < 1) {
			if (config.debug) console.error('menuMobile: Selected toggle element does not exists');
			return $toggle;
		}

		// Check if menu element was defined and if it exists in DOM
		if (config.menuElem) {
			config.$menu = $(config.menuElem);
			if (config.$menu.length) {
				delete config.$menu;
				if (config.debug) console.error('menuMobile: Selected menu object does not exits');
			}
		}

		// Handle toggle element click
		$toggle.on('click.' + config.eventsNamespace, function(event) {
			event.preventDefault();
			toggleMenu.call($toggle, config);
		});

		return $toggle;
	}

})(jQuery);