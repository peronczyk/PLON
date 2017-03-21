var debug = 1;


$(function() {

	// Settings

	var $received = $('#received-data'),
		$reaction = $('#reaction');

	// Start observing

	$received.observe({
		'debug': 1,
		'init': function(mutation) {
			console.log(mutation);
			$reaction.html('<p>Mutation detected.<br>Received first level DOM nodes: <strong>' + mutation.addedNodes.length + '</strong></p>');
		},
		'params': 'childList'
	});


	// Only for test functionalities

	$('#button-download').on('click', function(event) {

		// Insert some HTML code to received-data div
		// and observe reaction

		$received.html('<h3 class="test">This text was <strong class="lorem">insertet dynamically</strong></h3><p>Consectetur adipiscing elit un equat es bibendum</p>');

		return false;
	});

});