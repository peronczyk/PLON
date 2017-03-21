
/*	================================================================================
 *
 *	JQ: COOKIES INFO
 *
 *	Modified		: 2017-03-09
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {

			// Debug mode
			debug: 0,

			// Name of CSS class name, that makes cookies bar visible
			visibleClassName: 'is-Open',

			// DOM element inside cookies info box, that accepts cookie law
			acceptButton: 'button',

			// Cookie name stored in visitor's computer
			cookieName: 'cookies_accept',

			// Number of days after which cookies will be expired
			cookieExpiresAfter: 90,
		},
		cookies = document.cookie.split('; '),
		cookieStr, date, expires;


	/*	----------------------------------------------------------------------------
	 *	SET COOKIE
	 *	To remove cookie just set days to negative value
	 */

	var cookieSet = function(config) {
		date = new Date();
		date.setTime(date.getTime() + (config.cookieExpiresAfter * 24 * 60 * 60 * 1000));
		expires = date.toGMTString();
		document.cookie = config.cookieName + '=1; expires=' + expires + '; path=/';
		return true;
	};


	/*	----------------------------------------------------------------------------
	 *	GET COOKIE
	 */

	var cookieGet = function(config) {
		if (document.cookie !== '') {
			for (var i = 0; i < cookies.length; i++) {
				cookieStr = cookies[i].split('=');
				if (cookieStr[0] === config.cookieName) return unescape(cookieStr[1]);
			}
		}
		return null;
	};


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.cookiesInfo = function(options) {
		var config = $.extend({}, defaults, options); // Setup configuration
		var $that = $(this);

		if (config.debug) console.info('Plugin loaded: cookiesInfo');

		// Check if cookies bar exists in DOM
		if ($that.length < 1) {
			if (config.debug) console.error('cookiesInfo: Cookies bar not found.');
			return $that;
		}

		// Check if cookies law was accepted
		if (cookieGet(config) !== 1) {
			if (config.debug) console.info('cookiesInfo: Not accepted, open bar.');
			$that.addClass(config.visibleClassName);
		}
		else if (config.debug) console.log('cookiesInfo: Cookies accepted. Bar not shown.');

		// Accept cookies law
		$that.on('click', config.acceptButton, function() {
			if (cookieSet(config)) {
				$that.removeClass(config.visibleClassName);
				if (config.debug) console.info('cookiesInfo: Accepted, close bar.');
			}
			return false;
		});

		return $that;
	};

})(jQuery);