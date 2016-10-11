
/*	================================================================================
 *
 *	JQ: MODAL WINDOW
 *
 *	Script author	: Bartosz Perończyk (peronczyk.com)
 *	Created			: 2016-08-12
 *	Modified		: 2016-10-03
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Simple modal (popup) layer for websites.
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	Setup script in your custom.js this way: $.modal({});
 *	List of options with description is available below (default configuration)
 *
 *	--------------------------------------------------------------------------------
 *	TODO
 *
 *		- Method that opens modal in other scripts
 *		  eg.: $('.some-class').openModal({'type': });
 *
 *		- Auto injecting modal DOM structure to body
 *
 *		- Handling ESC and history back to close modal
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			'debug'	: 0,

			// Modal display elements selectors
			'wrapper'			: '.c_modal', // CSS selector for modal wrapper element
			'window'			: '.c_modal__window',
			'content'			: '.c_modal__content',
			'dataSelector'		: 'data-modal', // Data attribute name for DOM elements that should open modals
			'openBodyClassName' : 'is_modal-open',
		},
		$document = $('document'),
		$body = $('body');


	/*	----------------------------------------------------------------------------
	*	CLOSE MODAL WINDOW
	*/

	function closeModal(config, $wrapper) {
		if (config.debug) console.info('Modal: Close');
		$body.removeClass(config.openBodyClassName);
		$wrapper.removeAttr('open');
	}


	/*	----------------------------------------------------------------------------
	*	OPEN MODAL WINDOW
	*/

	function openModal(config, $wrapper) {
		if (config.debug) console.info('Modal: Open');
		$wrapper.attr('open', '');
		$body.addClass(config.openBodyClassName);
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.modal = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			$wrapper	= $(config.wrapper),
			$content	= $(config.content);

		if (config.debug) console.info('Plugin loaded: Modal');

		$wrapper = $(config.wrapper);

		if ($wrapper.length < 1) {
			console.error('Modal: Could not find modal wrapper element "' + config.wrapper + '"');
			return;
		}


		/*	------------------------------------------------------------------------
		 *	OPEN WINDOW
		 */

		$('[' + config.dataSelector +']').on('click.modal', function(event) {
			event.preventDefault();

			var selectorMode = $(this).attr(config.dataSelector);

			switch(selectorMode) {

				// Close modal
				case 'close': closeModal(config, $wrapper); break;

				// Open modal with content received from link title
				case 'title':
					var title = $(this).attr('title');
					if (title) {
						$content.html($(this).attr('title'));
						openModal(config, $wrapper);
						if (config.debug) console.info('Modal: Content taken from clicked element title');
					}
					else if (config.debug) console.error('Modal: No title content');
					break;

				// Open modal in gallery mode
				case 'image':
					if (config.debug) console.info('Modal: Gallery mode (unsupported at this moment)');
					alert('This mode is unsupported at this version of script');
					break;

				// Open modal with content received from YouTube
				case 'youtube':
					if (config.debug) console.info('Modal: Get movie from YouTube (unsupported at this moment)');
					alert('This mode is unsupported at this version of script');
					break;

				// Open modal with content received from async request
				case 'url':
					$.ajax({
						url: $(this).attr('href'),
						success: function(data) {
							if (config.debug) console.info('Modal: Content received successfully from AJAX request');
							$content.html(data);
							openModal(config, $wrapper);
						},
						error: function(jqXHR) {
							if (config.debug) console.error('Modal: Couldn\'t get content from URL provided in clicked element');
						}
					});
					break;

				default:
					if (config.debug) console.error('Modal: Unknown modal selector type - "' + selectorMode + '"');
			}
		});


		/*	------------------------------------------------------------------------
		 *	REACT ON CLICKING OUTSIDE OPENED MODAL WINDOW
		 */

		$wrapper.on('click.modal', function(event) {
			if(!$(event.target).closest(config.window).length) {
				if (config.debug) console.info('Modal: Clicked outside window');
				closeModal(config, $wrapper);
			}
		});
	}

})(jQuery);