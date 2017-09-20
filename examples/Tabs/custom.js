/*
	global Tabs
*/

var debug = 1;

$(function() {

	'use strict';

	// Use as jQuery plugin
	var $tabs1 = $('#tabs1 [role="tablist"]');
	$tabs1.tabs({
		debug: debug
	});

	// Event catching example
	$tabs1.on('change.tabs.plon', function(event) {
		console.group('Catched tabs event');
		console.log(event);
		console.groupEnd();
	});

	// Use as constructor
	var tabs2 = new Tabs('#tabs2', {
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