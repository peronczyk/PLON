
/*	================================================================================
 *
 *	JQ: COOKIES INFO
 *
 *	Script author	: Bartosz Perończyk (peronczyk.com)
 *	Contributors	: Future Processing Design Team
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Shows information about cookies law used on website
 *	and button to close this information.
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	$('.some-element').cookiesInfo({'visibleClassName': 'is-open'});
 *		some-element - DOM element, that contains cookies law info
 *			and <button> inside it
 *		visibleClassName - CSS class name, that makes 'some-element' visible
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug				: 0,
			visibleClassName	: 'is-open', // Name of CSS class name, that makes cookies bar visible
			acceptButton		: 'button', // DOM element inside cookie bar, that accepts cookie law
			cookieName			: 'cookies_accept', // Cookie name stored in visitor's computer
			cookieExpiresAfter	: 90, // Number of days after which cookies will be expired
		},
		cookies = document.cookie.split('; '),
		cookieStr, date, expires;


	/*	----------------------------------------------------------------------------
	 *	SET COOKIE
	 *	To remove cookie just set days to negative value
	 */

	function cookieSet(config) {
		date = new Date();
		date.setTime(date.getTime() + (config.cookieExpiresAfter * 24 * 60 * 60 * 1000));
		expires = date.toGMTString();
		document.cookie = config.cookieName + '=1; expires=' + expires + '; path=/';
		return true;
	}


	/*	----------------------------------------------------------------------------
	 *	GET COOKIE
	 */

	function cookieGet(config) {
		if (document.cookie != '') {
			for(var i = 0; i < cookies.length; i++) {
				cookieStr = cookies[i].split('=');
				if (cookieStr[0] === config.cookieName) return unescape(cookieStr[1]);
			}
		}
		return null;
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.cookiesInfo = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self = $(this);

		if (config.debug) console.info('Plugin loaded: cookiesInfo');

		// Check if cookies bar exists in DOM

		if (_self.length < 1) {
			if (config.debug) console.error('cookiesInfo: Cookies bar not found.');
			return _self;
		}

		// Check if cookies law was accepted

		if (cookieGet(config) != 1) {
			if (config.debug) console.info('cookiesInfo: Not accepted, open bar.');
			_self.addClass(config.visibleClassName);
		}
		else if (config.debug) console.log('cookiesInfo: Cookies accepted. Bar not shown.');

		// Accept cookies law

		_self.on('click', config.acceptButton, function() {
			if (cookieSet(config)) {
				_self.removeClass(config.visibleClassName);
				if (config.debug) console.info('cookiesInfo: Accepted, close bar.');
			}
			return false;
		});

		return _self;
	}

})(jQuery);