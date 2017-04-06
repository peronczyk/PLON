var debug = 1;

$(function() {

	'use strict';

	// Plugin setup
	$('#cookies-bar').cookiesInfo({
		debug: debug
	});

	// Reset button only for showcase purposes
	/*$('#reset').on('click', function() {
		cookieSet('cookies_accept', 0, -1);
		console.log('Reset');
		location.reload();
	});*/

});