/* global Modal */

var debug = 1;

$(function() {

	'use strict';

	new Modal({
		debug: debug
	});


	// Additional code only for showcase purposes

	$(document).on('click', '#load-more-lorem', function(event) {
		event.preventDefault();
		$(this).parent().prepend('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non mi felis. Proin tempus risus sed euismod sagittis. Vestibulum non urna ac lorem lobortis vestibulum venenatis nec dolor. Etiam posuere odio ut augue tincidunt vestibulum. Phasellus ultricies luctus purus et vehicula.</p>');
	});

});