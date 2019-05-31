var debug = true;

$(function() {

	'use strict';

	// Plugin setup
	$('.c-CookiesBar').cookiesInfo({
		debug: debug
	});

	// Reset button only for showcase purposes
	/*$('#reset').on('click', function() {
		cookieSet('cookies_accept', 0, -1);
		console.log('Reset');
		location.reload();
	});*/

});