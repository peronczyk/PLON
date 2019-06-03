/**
 * =================================================================================
 *
 * PLON Component : Modal
 *
 * @author     Bartosz Perończyk (peronczyk.com)
 * @modified   2019-05-30
 * @repository https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.Modal = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @var {Object} options
	 */

	constructor(options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the browser.
			 * @var {Boolean}
			 */
			debug: false,

			/**
			 * CSS selector for modal wrapper element
			 */
			wrapper: '.c-Modal',

			/**
			 * CSS selector for child element of wrapper that will position content.
			 * this class is used to determine if user clicked inside modal
			 * or outside to close it.
			 */
			window: '.c-Modal__Window',

			/**
			 * CSS selector for child element of wraper that will contain
			 * content of modal (eg.: text, images).
			 */
			content: '.c-Modal__Content',

			/**
			 * Data attribute name for DOM elements that should open modals
			 * after clicking on them
			 */
			dataSelector: 'data-modal',

			/**
			 * CSS class name added to <body> tag that indicates if modal is open.
			 * Use it to hide browser scroll bar and to add styling to modal.
			 */
			openBodyClassName: 'c-Modal__is-Open',

			/**
			 * CSS class name added to <body> when content was loaded succesfully.
			 */
			loadedBodyClassName: 'c-Modal__is-Loaded',

			contentTypeClasses: {
				dom	  : 'is-Dom',
				image : 'is-Image',
				title : 'is-Title',
				url   : 'is-Url'
			}
		};

		this.config = { ...defaults, ...options };
		this.$body = $('body');

		if (!this.config.wrapper || !this.config.window || !this.config.content) {
			this.debugLog(`Configuration error - one of the required options is missing: wrapper, window or content`, 'warn');
			return false;
		}

		this.$wrapper = $(this.config.wrapper);
		this.$window  = this.$wrapper.find(this.config.window);
		this.$content = this.$wrapper.find(this.config.content);

		if (!this.$wrapper.length || !this.$window.length || !this.$content.length) {
			this.debugLog(`Could not find one of modal key elements.
				\n - ${this.config.wrapper}: ${this.$wrapper.length}
				\n - ${this.config.window}: ${this.$window.length}
				\n - ${this.config.content}: ${this.$content.length}`);
			return false;
		}

		this.addClickHandler();

		// Handle clicking outside modal content box
		this.$wrapper.on('click.modal.plon', (event) => {
			let $closestWindow = $(event.target).closest(this.config.window);
			if (!$closestWindow.length) {
				this.debugLog(`Clicked outside window`, 'info');
				this.closeModal();
			}
		});

		this.debugLog(`Initiated`);
	}


	/** ----------------------------------------------------------------------------
	 * Auto Detect Mode
	 * @param {object} $elem
	 */

	autoDetectMode($elem) {
		let href     = $elem.attr('href');
		let title    = $elem.attr('title');
		let detected = false;

		// Empty href - try to insert title attribute content
		if (!href || href.length < 3) {
			if (title && title.length) {
				detected = this.loadTitle($elem);
			}
		}

		// Hash - ID of DOM element
		else if (href.substring(0, 1) === '#') {
			detected = this.loadDom(href);
		}

		// Image
		else if (href.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			detected = this.loadImage(href);
		}

		// URL
		else if (href.substring(0, 8) === 'https://' || href.substring(0, 7) === 'http://') {
			detected = this.loadUrl(href);
		}

		if (!detected) {
			this.debugLog(`Unknown mode`);
		}
	};


	/** ----------------------------------------------------------------------------
	 * This method adds class names to wrapper to show user that modal is loading
	 * some data.
	 */

	startModal() {
		this.$body.addClass(this.config.openBodyClassName);
	};


	/** ----------------------------------------------------------------------------
	 * Open Modal
	 * @param {String} contentType
	 */

	openModal(contentType) {
		this.$body.addClass(this.config.loadedBodyClassName);

		this.$wrapper
			.addClass(this.config.contentTypeClasses[contentType])
			.attr('open', '')
			.attr('aria-hidden', 'false')
			.scrollTop(0, 0);

		$(window).trigger('modalopen');
	};


	/** ----------------------------------------------------------------------------
	 * Close Modal
	 */

	closeModal() {
		this.$body.removeClass(this.config.openBodyClassName + ' ' + this.config.loadedBodyClassName);

		this.$wrapper
			.removeAttr('open')
			.attr('aria-hidden', 'true')
			.removeClass($.map(this.config.contentTypeClasses, (elem) => elem).join(' '));

		this.$content.empty();

		this.$window.css({width: ''});

		$(window).trigger('modalclose');
	};


	/** ----------------------------------------------------------------------------
	 * Insert Text
	 * @param {String} text
	 */

	insertText(text) {
		this.$content.html(text);
	};


	/** ----------------------------------------------------------------------------
	 * Insert Image
	 * @param {Object} image
	 */

	insertImage(image) {
		let imageWidth  = image.width;
		let imageHeight = image.height;
		let $image      = $(image);

		$image.wrap('<div></div>').appendTo(this.$content.empty());

		if (imageWidth > imageHeight) {
			var windowExpectedWidth = imageWidth + this.$content.innerWidth() - this.$content.width();

			$image.css({width: '100%'});
			this.$window.css({ width: windowExpectedWidth });
		}

		this.debugLog(`Image inserted`);
	};


	/** ----------------------------------------------------------------------------
	 * Open modal with content received from link title
	 * @param {Object} $elem
	 */

	loadTitle($elem) {
		this.startModal();
		this.insertText($elem.attr('title'));
		this.openModal('title');
		this.debugLog(`Text loaded from title attribute`);

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * Open modal with content received from async request
	 * @param {String} url
	 */

	loadUrl(url) {
		this.startModal();

		$.ajax({
			url,
			success: (data) => {
				this.insertText(data);
				this.openModal('url');
				$(window).trigger('modalcontentloaded');
			},
			error: () => {
				this.debugLog(`Could not load content from URL ${url}`);
			}
		});

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * Load Image
	 * @param {String} imageUrl
	 */

	loadImage(imageUrl) {
		this.startModal();

		let image = new Image();

		$(image)
			.attr('src', imageUrl)
			.on('load', (event) => {
				this.debugLog(`Image loaded from: ${imageUrl}`);
				this.insertImage(this);
				this.openModal('image');
				$(window).trigger('modalcontentloaded');
			})
			.on('error', () => {
				this.debugLog(`Image cant be loaded from url: ${imageUrl}`, 'warn');
			});

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * Loads content from DOM element selected by domId
	 * @param {String} domId
	 */

	loadDom(domId) {
		this.startModal();
		var $elem = $(domId);

		if ($elem.length < 1) {
			this.debugLog(`DOM element "${domId}" not found.`, 'warn');
			return false;
		}

		this.insertText($elem.html());
		this.openModal('dom');
		this.debugLog(`DOM element "${domId}" content loaded.`, 'info');

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * Handle clicking on links marked as modal togglers
	 */

	addClickHandler() {
		if (!this.config.dataSelector) {
			this.debugLog(`dataSelector was not provided - component will not react on any clicks.`, 'warn');
			return;
		}

		this.$body.on('click.modal.plon', `[${this.config.dataSelector}]`, (event) => {
			event.preventDefault();

			let $clickedElem = $(event.target);
			let modalClickType = $clickedElem.attr(this.config.dataSelector);

			switch (modalClickType) {
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
	};


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 */

	debugLog(message, type = 'log') {
		if (this.config.debug) {
			console[type]('[PLON / Modal]', message);
		}
	}
};