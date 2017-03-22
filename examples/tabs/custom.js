/*
	global Tabs
*/

var debug = 1;

$(function() {

	'use strict';

	// Use as jQuery plugin
	$('#tabs1 [role="tablist"]').tabs({
		debug: debug
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

	console.log(tabs2);

});