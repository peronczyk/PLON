/* global MenuMobile */

$(function() {

	'use strict';

	new MenuMobile({
		debug					: true,
		toggleElem				: '#mobile-menu-toggle',
		menuElem				: '#main-menu',
		closeByClickingMenuLink	: true,
	});

});