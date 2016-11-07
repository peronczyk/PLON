
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
			'debug'					: 0,
			'toggleElem'			: null,
			'openClassName'			: null, // CSS class added to toggle and menu container
			'openDataName'			: 'menumobile-open', // Data atribute name to indicate whether menu is open or closed
			'openBodyClassName'		: 'Menu-mobile_is-Open', // CSS class added to body element when menu is open. Used for disabling scroll
			'eventsNamespace'		: 'menumobile',
			'closeByClickingOutside': true,
			'closeByClickingBack'	: true,
		};



	/*	----------------------------------------------------------------------------
	 *	MENU TOGGLE
	 */

	function toggleMenu(config, _self, $menuToggle) {

		// CLOSE MENU

		if (_self.data(config.openDataName) == true) {

			// Set data information about changed menu state
			_self.data(config.openDataName, false);

			if (config.debug) console.log('menuMobile: Close');

			// Remove active classes from toggle and menu elemens
			if (config.openClassName) _self.add($menuToggle).removeClass(config.openClassName);

			// Remove specific class from body element
			if (config.openBodyClassName) $('body').removeClass(config.openBodyClassName);

			// Turn off ALL events monitoring (clicking outside menu, history back, escape key)
			$(window).add(document).off('.' + config.eventsNamespace);
		}


		// OPEN MENU

		else {

			// Set data information about changed menu state
			_self.data(config.openDataName, true);

			if (config.debug) console.log('menuMobile: Open');

			// Add active classes to toggle and menu elemens
			if (config.openClassName) _self.add($menuToggle).addClass(config.openClassName);

			// Add specific class from body element
			if (config.openBodyClassName) $('body').addClass(config.openBodyClassName);

			// Handle clicking on menu link or outside opened menu
			$(document).on('click.' + config.eventsNamespace, function(event) {

				// Close menu if clicked element is a menu link
				if ($(event.target).is(_self.find('a'))) {
					if (config.debug) console.log('menuMobile: Menu link clicked');
					toggleMenu(config, _self, $menuToggle);
				}

				// Close menu if clicked outside menu object
				else if (config.closeByClickingOutside && !$(event.target).closest(_self).length) {
					if (config.debug) console.log('menuMobile: Clicked outside opened menu');
					toggleMenu(config, _self, $menuToggle);
					return false;
				}
			});

			// Add ability to use history back to close popup
			if (config.closeByClickingBack) {
				window.history.pushState({type: "menumobile"}, null, null); // Set history state

				$(window).on('popstate.' + config.eventsNamespace, function(event) {
					toggleMenu(config, _self, $menuToggle);
					if (config.debug) console.log('menuMobile: History change event triggered while menu was open');
				});
			}

			// Handle escape key to close opened navigation menu
			$(document).on('keyup.' + config.eventsNamespace, function(event) {
				if (event.which == 27) {
					toggleMenu(config, _self, $menuToggle);
					if (config.debug) console.log('menuMobile: Escape key pressed');
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
			_self = this,
			$menuToggle; // Link to menu toggle button object;

		if (config.debug) console.info('Plugin loaded: menuMobile');

		// Check if selected menu exits in document
		if (_self.length < 1) {
			if (config.debug) console.error('menuMobile: Selected menu object does not exits in document');
			return _self;
		}

		// Check if toggle element was specified
		if (!options.toggleElem) {
			if (config.debug) console.error('menuMobile: No toggle element specified')
			return _self;
		}

		// Check if toggle element exist in DOM
		$menuToggle = $(config.toggleElem);
		if ($menuToggle.length < 1) {
			if (config.debug) console.error('menuMobile: Specified toggle element doesn\'t exist in document');
			return _self;
		}

		// Handle menu toggle button click
		$menuToggle.on('click.' + config.eventsNamespace, function() {
			toggleMenu(config, _self, $menuToggle);
			return false;
		});

		return _self;
	}

})(jQuery);