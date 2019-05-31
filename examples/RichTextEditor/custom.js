/* global RichTextEditor */

$(function() {

	'use strict';

	var options = {debug: true};

	$('[data-rte]').each(function(index, elem) {
		new plon.RichTextEditor(elem, options);
	});

});