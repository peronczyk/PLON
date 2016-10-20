
/*	================================================================================
 *
 *	JQ: TABS
 *
 *	Author			: Bartosz Perończyk
 *	Created			: 2015-08-26
 *	Modified		: 2016-07-19
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	Example: $('.tabs').tabs();
 *
 *	--------------------------------------------------------------------------------
 *	TODO:
 *
 *	Navigation with keyboard and reacting on history back/forward
 *
 *	================================================================================ */


(function($) {

	'use strict';


	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			'debug'			: 0,
			'openClassName'	: 'is-Active'
		},
		tabName, containerID, $clickedLink, $container, $tabContent;


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.tabs = function(options) {

		var
			// Setup configuration
			config	= $.extend({}, defaults, options),

			// Definitions
			_self	= this;

		if (config.debug) console.info('Plugin loaded: Tabs');

		// React on tab clicking

		_self.on('click.tabs', 'a', function() {

			$clickedLink	= $(this),
			tabName			= $clickedLink.attr('href').split('#')[1],
			containerID		= $clickedLink.closest('[data-for]').data('for');

			// Check if DOM elements are OK

			if (!containerID || containerID.length <= 0) {
				if (config.debug) console.error('Tabs: Clicked tabs group doesn\'t have data-for or it\'s empty: ' + containerID);
				return false;
			}

			if (!tabName || tabName.length <= 0) {
				if (config.debug) console.error('Tabs: Tab clicked but href was empty: ' + tabName);
				return false;
			}

			$container = $('#' + containerID);

			if ($container.length <= 0) {
				if (config.debug) console.error('Tabs: Specified tabs container doesn\'t exist: ' + containerID);
				return false;
			}

			else {
				$tabContent = $('.' + tabName);

				if ($tabContent.length > 0) {

					// Change current tab class
					$clickedLink
						.parent('li').addClass(config.openClassName)
						.siblings().removeClass(config.openClassName);

					// Change content tab class
					$tabContent.addClass(config.openClassName)
						.siblings().removeClass(config.openClassName);

					// Change size of tab container to allow it's animation
					$container.css({'height': $tabContent.outerHeight()});

					if (config.debug) console.info('Tabs: Tab content changed to: ' + tabName);
				}

				else if (config.debug) console.error('Tabs: Specified tab content doesn\'t exist: ' + tabName);
			}

			return false;
		});

		return _self;

	}

})(jQuery);