
/*	================================================================================
 *
 *	JQ: MODAL
 *
 *	Modified		: 2017-03-09
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug : 0,

			// CSS selector for modal wrapper element
			wrapperElem: '.c-Modal',

			// CSS selector for child element of wrapper that will position content.
			// this class is used to determine if user clicked inside modal
			// or outside to close it.
			windowElem: '.c-Modal__window',

			// CSS selector for child element of wraper that will contain content
			// of modal (eg.: text, images)
			contentElem: '.c-Modal__content',

			// Data attribute name for DOM elements that should open modals
			// after clicking on them
			dataSelector: 'data-modal',

			// CSS class name added to <body> tag that indicates if modal is open.
			// Use it to hide browser scroll bar and to add styling to modal.
			openBodyClassName: 'c-Modal__is-Open',
		},
		$document = $('document'),
		$body = $('body');


	/*	----------------------------------------------------------------------------
	 *	CLOSE MODAL WINDOW
	 */

	var closeModal = function(config, $wrapper) {
		if (config.debug) console.info('Modal: Close');
		$body.removeClass(config.openBodyClassName);
		$wrapper.removeAttr('open');
	}


	/*	----------------------------------------------------------------------------
	 *	OPEN MODAL WINDOW
	 */

	var openModal = function(config, $wrapper) {
		if (config.debug) console.info('Modal: Open');
		$wrapper.attr('open', '');
		$body.addClass(config.openBodyClassName);
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.modal = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		if (config.debug) console.info('Plugin loaded: Modal');

		if (!config.wrapper || !config.window || !config.content) {
			console.error('Modal: Configuration error - one of the required options is missing: wrapper, window or content');
			return false;
		}

		var $wrapper	= $(config.wrapper),
			$inner		= $(config.window),
			$content	= $(config.content);

		if ($wrapper.length < 1) {
			console.error('Modal: Could not find modal wrapper element "' + config.wrapper + '"');
			return;
		}

		if ($inner.length < 1) {
			console.error('Modal: Could not find modal window element "' + config.window + '"');
			return;
		}

		if ($content.length < 1) {
			console.error('Modal: Could not find modal content element "' + config.content + '"');
			return;
		}

		$.on('click.modal', '[' + config.dataSelector +']', function(event) {
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
					if (config.debug) console.info('Modal: Gallery mode (unsupported in this version)');
					alert('This mode is unsupported at this version of script');
					break;

				// Open modal with content received from YouTube
				case 'youtube':
					if (config.debug) console.info('Modal: Get movie from YouTube (unsupported in this version)');
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
							if (config.debug) console.warn('Modal: Couldn\'t get content from URL provided in clicked element');
						}
					});
					break;

				default:
					if (config.debug) console.warn('Modal: Unknown modal selector type - "' + selectorMode + '"');
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