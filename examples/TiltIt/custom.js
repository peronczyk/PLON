var debug = 1;

$(function() {

	// Basic usage
	$('.tilt-1').tiltIt({
		'debug': debug
	});

	// Advanced usage
	$('.tilt-2').tiltIt({
		'debug'		: debug,
		'canvas'	: $('.parent-2'),
		'strength'	: -40,
		'scale'		: 1.3,
	});

});