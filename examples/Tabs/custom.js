/*
	global Tabs
*/

var debug = 1;

$(function() {

	'use strict';

	// First tabs

	var tabs1 = new plon.Tabs('#tabs1', {
		debug: debug,
	});

	// Second tabs
	var tabs2 = new plon.Tabs('#tabs2', {
		debug: debug,
		autoActivateTab: 2
	});

	$('#tabs2-prev').on('click', function(event) {
		event.preventDefault();
		tabs2.previousTab();
	});

	$('#tabs2-next').on('click', function(event) {
		event.preventDefault();
		tabs2.nextTab();
	});

	$('#tabs2-first').on('click', function(event) {
		event.preventDefault();
		tabs2.changeTab(0);
	});

});