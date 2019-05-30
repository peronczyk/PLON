/**
 * =================================================================================
 *
 * PLON Component : Modal
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2019-05-30
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.Modal = function(options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * DEFINITIONS
	 */

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

			// CSS class name added to <body> when content was loaded succesfully.
			loadedBodyClassName: 'c-Modal__is-Loaded',

			contentTypeClasses: {
				dom	  : 'is-Dom',
				image : 'is-Image',
				title : 'is-Title',
				url   : 'is-Url'
			}
		};

	// Shortcuts
	const $body = $('body');

	// Setting up configuration
	this.config = $.extend({}, defaults, options);

	// Common variables definition
	var $wrapper, $window, $content;


	/** ----------------------------------------------------------------------------
	 * METHOD: Auto Detect Mode
	 * @param {object} $elem
	 */

	this.autoDetectMode = ($elem) => {
		let href     = $elem.attr('href');
		let title    = $elem.attr('title');
		let detected = false;

		if (href.length < 3) {
			if (title && title.length) {
				this.loadTitle($elem);
				detected = true;
			}
		}
		else if (href.substring(0, 1) === '#') {
			this.loadDom(href);
			detected = true;
		}
		else if (href.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			this.loadImage(href);
			detected = true;
		}
		else if (href.substring(0, 8) === 'https://' || href.substring(0, 7) === 'http://') {
			this.loadUrl(href);
			detected = true;
		}

		if (!detected && this.config.debug) {
			console.warn('[PLON / Modal] Unknown mode');
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Start Modal
	 * This method adds class names to wrapper to show user that modal is loading
	 * some data.
	 */

	this.startModal = () => {
		$body.addClass(this.config.openBodyClassName);
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Open Modal
	 * @param {string} contentType
	 */

	this.openModal = (contentType) => {
		$body.addClass(this.config.loadedBodyClassName);

		$wrapper
			.addClass(this.config.contentTypeClasses[contentType])
			.attr('open', '')
			.attr('aria-hidden', 'false')
			.scrollTop(0, 0);

		$(window).trigger('modalopen');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Close Modal
	 */

	this.closeModal = () => {
		$body.removeClass(this.config.openBodyClassName + ' ' + this.config.loadedBodyClassName);

		$wrapper
			.removeAttr('open')
			.attr('aria-hidden', 'true')
			.removeClass($.map(this.config.contentTypeClasses, (elem) => elem).join(' '));

		$content.empty();

		$window.css({width: ''});

		$(window).trigger('modalclose');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Insert Text
	 */

	this.insertText = (text) => {
		$content.html(text);
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Insert Image
	 * @param {object} image
	 */

	this.insertImage = (image) => {
		let imageWidth  = image.width;
		let imageHeight = image.height;
		let $image      = $(image);

		$image.wrap('<div></div>').appendTo($content.empty());

		if (imageWidth > imageHeight) {
			var windowExpectedWidth = imageWidth + $content.innerWidth() - $content.width();

			$image.css({width: '100%'});
			$window.css({width: windowExpectedWidth});
		}

		if (this.config.debug) {
			console.info('[PLON / Modal] Image inserted');
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Title
	 * Open modal with content received from link title
	 * @param {object} $elem
	 */

	this.loadTitle = ($elem) => {
		this.startModal();
		this.insertText($elem.attr('title'));
		this.openModal('title');

		if (this.config.debug) {
			console.info('[PLON / Modal] Text loaded from title attribute');
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Url
	 * Open modal with content received from async request
	 * @param {string} url
	 */

	this.loadUrl = (url) => {
		this.startModal();

		$.ajax({
			url: url,
			success: (data) => {
				this.insertText(data);
				this.openModal('url');
				$(window).trigger('modalcontentloaded');
			},
			error: () => {
				if (this.config.debug) {
					console.warn('[PLON / Modal] Couldn\'t load content from URL ' + url);
				}
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load Image
	 * @param {string} imageUrl
	 */

	this.loadImage = (imageUrl) => {
		this.startModal();

		let image = new Image();

		$(image)
			.attr('src', imageUrl)
			.on('load', (event) => {
				console.log(event);

				if (this.config.debug) {
					console.info('[PLON / Modal] Image loaded from: ' + imageUrl);
				}
				this.insertImage(this);
				this.openModal('image');
				$(window).trigger('modalcontentloaded');
			})
			.on('error', () => {
				console.warn('[PLON / Modal] Image can\'t be loaded from url: ' + imageUrl);
			});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Load DOM
	 * Loads content from DOM element selected by domId
	 * @param {string} domId
	 */

	this.loadDom = (domId) => {
		this.startModal();
		var $elem = $(domId);

		if ($elem.length) {
			this.insertText($elem.html());
			this.openModal('dom');

			if (this.config.debug) {
				console.info('[PLON / Modal] DOM element "' + domId + '" content loaded');
			}
		}
		else if (this.config.debug) {
			console.warn('[PLON / Modal] DOM element "' + domId + '" not found');
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Add Click Handler
	 * Handle clicking on links marked as modal togglers
	 */

	this.addClickHandler = () => {
		if (this.config.dataSelector) {
			$body.on('click.modal.plon', '[' + this.config.dataSelector +']', (event) => {
				event.preventDefault();

				var $clickedElem = $(event.target);

				switch ($clickedElem.attr(this.config.dataSelector)) {
					case 'close':
						this.closeModal();
						break;

					case 'dom':
						this.loadDom($clickedElem.attr('href'));
						break;

					case 'image':
						this.loadImage($clickedElem.attr('href'));
						break;

					case 'title':
						this.loadTitle($clickedElem);
						break;

					case 'url':
						this.loadUrl($clickedElem.attr('href'));
						break;

					default:
						this.autoDetectMode($clickedElem);
				}
			});
		}
		else if (this.config.debug) {
			console.warn('[PLON / Modal] dataSelector was not provided - component will not react on any clicks');
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Init
	 */

	this.init = () => {
		if (!this.config.wrapper || !this.config.window || !this.config.content) {
			console.warn('[PLON / Modal] Configuration error - one of the required options is missing: wrapper, window or content');
			return false;
		}

		$wrapper = $(this.config.wrapper);
		$window  = $wrapper.find(this.config.window);
		$content = $wrapper.find(this.config.content);

		if (!$wrapper.length || !$window.length || !$content.length) {
			console.warn('[PLON / Modal] Could not find one of modal key elements.\n - ' + this.config.wrapper + ': ' + $wrapper.length + '\n - ' + this.config.window + ': ' + $window.length + '\n - ' + this.config.content + ': ' + $content.length);
			return false;
		}

		this.addClickHandler();

		// Handle clicking outside modal content box
		$wrapper.on('click.modal.plon', (event) => {
			if (!$(event.target).closest(this.config.window).length) {
				if (this.config.debug) {
					console.info('[PLON / Modal] Clicked outside window');
				}
				this.closeModal();
			}
		});

		if (this.config.debug) {
			console.info('[PLON / Modal] Initiated');
		}

		return this;
	};

	return this.init();
};