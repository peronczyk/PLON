/* global MenuMobile */

$(function() {

	'use strict';

	new plon.MenuMobile('#mobile-menu-toggle', {
		menuElem: '#main-menu',
		debug: true,
		closeByClickingMenuLink: true,
	});

});