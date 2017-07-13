
/*	================================================================================
 *
 *	MODAL COMPONENT
 *
 *	Modified		: 2017-03-30
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */

window.Modal = function(options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * DEFINITIONS
	 */

	var that = this;

	// Default configuration
	var defaults =
		{
			debug : 0,

			// CSS selector for modal wrapper element
			wrapper: '.c-Modal',

			// CSS selector for child element of wrapper that will position content.
			// this class is used to determine if user clicked inside modal
			// or outside to close it.
			window: '.c-Modal__window',

			// CSS selector for child element of wraper that will contain
			// content of modal (eg.: text, images)
			content: '.c-Modal__content',

			// Data attribute name for DOM elements that should open modals
			// after clicking on them
			dataSelector: 'data-modal',

			// CSS class name added to <body> tag that indicates if modal is open.
			// Use it to hide browser scroll bar and to add styling to modal.
			openBodyClassName: 'c-Modal__is-Open',

			contentTypeClasses: {
				dom		: 'is-Dom',
				image	: 'is-Image',
				title	: 'is-Title',
				url		: 'is-Url'
			}
		};

	// Shortcuts
	var $body = $('body');

	// Setting up configuration
	var config = $.extend({}, defaults, options);

	// Common variables definition
	var $wrapper, $window, $content;


	/** ----------------------------------------------------------------------------
	 * METHOD: Auto Detect Mode
	 * @param {object} $elem
	 */

	this.autoDetectMode = function($elem) {
		var href = $elem.attr('href'),
			title = $elem.attr('title'),
			detected = false;

		if (href.length < 3) {
			if (title && title.length) {
				that.loadTitle($elem);
				detected = true;
			}
		}
		else if (href.substring(0, 1) === '#') {
			that.loadDom(href);
			detected = true;
		}
		else if (href.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			that.loadImage(href);
			detected = true;
		}
		else if (href.substring(0, 8) === 'https://' || href.substring(0, 7) === 'http://') {
			that.loadUrl(href);
			detected = true;
		}

		if (!detected && config.debug) console.warn('Modal: Unknown mode');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Open Modal
	 * @param {string} contentType
	 */

	this.openModal = function(contentType) {
		$body.addClass(config.openBodyClassName);
		$wrapper
			.addClass(config.contentTypeClasses[contentType])
			.attr('open', '')
			.attr('aria-hidden', 'false');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Close Modal
	 */

	this.closeModal = function() {
		$body.removeClass(config.openBodyClassName);
		$wrapper
			.removeAttr('open')
			.attr('aria-hidden', 'true');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Insert Text
	 */

	this.insertText = function(text) {
		$content.html(text);
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Insert Image
	 * @param {object} image
	 */

	this.insertImage = function(image) {
		var imageWidth = image.width,
			imageHeight = image.height,
			$image = $(image);

		$image.wrap('<div></div>').appendTo($content.empty());

		if (imageWidth > imageHeight) {
			var windowExpectedWidth = imageWidth + $content.innerWidth() - $content.width();

			$image.css({width: '100%'});
			$window.css({width: windowExpectedWidth});
		}

		if (config.debug) console.info('Modal: Image inserted');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Title
	 * Open modal with content received from link title
	 * @param {object} $elem
	 */

	this.loadTitle = function($elem) {
		that.insertText($elem.attr('title'));
		that.openModal('title');
		if (config.debug) console.info('Modal: Text loaded from title attribute');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Url
	 * Open modal with content received from async request
	 * @param {string} url
	 */

	this.loadUrl = function(url) {
		$.ajax({
			url: url,
			success: function(data) {
				that.insertText(data);
				that.openModal('url');
				if (config.debug) console.info('Modal: Content loaded asynchronously from URL ' + url);
			},
			error: function() {
				if (config.debug) console.warn('Modal: Couldn\'t load content from URL ' + url);
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Image
	 * @param {string} imageUrl
	 */

	this.loadImage = function(imageUrl) {
		var image = new Image();
		$(image)
			.attr('src', imageUrl)
			.on('load', function() {
				if (config.debug) console.info('Modal: Image loaded from: ' + imageUrl);
				that.insertImage(this);
				that.openModal('image');
			})
			.on('error', function() {
				console.warn('Modal: Image can\'t be loaded from url: ' + imageUrl);
			});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load DOM
	 * Loads content from DOM element selected by domId
	 * @param {string} domId
	 */

	this.loadDom = function(domId) {
		var $elem = $(domId);
		if ($elem.length) {
			that.insertText($elem.html());
			that.openModal('dom');
			if (config.debug) console.info('Modal: DOM element "' + domId + '" content loaded');
		}
		else if (config.debug) console.info('Modal: DOM element "' + domId + '" not found');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Add Click Handler
	 * Handle clicking on links marked as modal togglers
	 */

	this.addClickHandler = function() {
		if (config.dataSelector) {
			$body.on('click.modal', '[' + config.dataSelector +']', function(event) {
				event.preventDefault();

				var $clickedElem = $(this);

				switch ($clickedElem.attr(config.dataSelector)) {
					case 'close'	: that.closeModal(); break;

					case 'dom'		: that.loadDom($clickedElem.attr('href')); break;
					case 'image'	: that.loadImage($clickedElem.attr('href')); break;
					case 'title'	: that.loadTitle($clickedElem); break;
					case 'url'		: that.loadUrl($clickedElem.attr('href')); break;

					default: that.autoDetectMode($clickedElem);
				}
			});
		}
		else if (config.debug) console.log('Modal: dataSelector was not provided - component will not react on any clicks');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Init
	 */

	this.init = function() {
		if (!config.wrapper || !config.window || !config.content) {
			console.warn('Modal: Configuration error - one of the required options is missing: wrapper, window or content');
			return false;
		}

		$wrapper	= $(config.wrapper);
		$window		= $wrapper.find(config.window);
		$content	= $wrapper.find(config.content);

		if (!$wrapper.length || !$window.length || !$content.length) {
			console.warn('Modal: Could not find one of modal key elements.\n - ' + config.wrapper + ': ' + $wrapper.length + '\n - ' + config.window + ': ' + $window.length + '\n - ' + config.content + ': ' + $content.length);
			return false;
		}

		that.addClickHandler();

		// Handle clicking outside modal content box
		$wrapper.on('click.modal', function(event) {
			if (!$(event.target).closest(config.window).length) {
				if (config.debug) console.info('Modal: Clicked outside window');
				that.closeModal();
			}
		});

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * INITIATE COMPONENT
	 */

	if (this.init() && config.debug) console.info('[PLON] Modal initiated');
};