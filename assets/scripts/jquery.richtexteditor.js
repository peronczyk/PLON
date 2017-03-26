
/*	================================================================================
 *
 *	JQ: RICH TEXT EDITOR
 *
 *	Modified		: 2017-03-14
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


(function($) {

	'use strict';


	/*	----------------------------------------------------------------------------
	 *	GLOBAL CONSTRUCTOR FOR COMPONENT
	 */

	window.RichTextEditor = function(elem, options) {

		var that = this;

		// Default configuration
		var defaults = {
			debug: false,
			classNames: {
				wrapper	: 'o-Rte',
				toolbar	: 'o-Rte__toolbar',
				editor	: 'o-Rte__editor',
				source	: 'o-Rte__source',
				sublist	: 'o-Rte__sublist',
				hidden	: 'u-Hidden',
				active	: 'is-Active',
				disabled: 'is-Disabled',
			},
			toolbarElements: [['h1', 'h2', 'code'], 'bold', 'italic', 'underline', 'ul', 'ol', 'link', 'undo', 'redo', 'clearFormatting', 'source'],
			lang: {
				styles: 'Styles',
				h1: 'Header level 1',
				h2: 'Header level 2',
				code: 'Code block',
				bold: 'Bold text',
				italic: 'Italic text',
				underline: 'Underlined text',
				ul: 'Unordered list',
				ol: 'Ordered list',
				link: 'Link to online resource',
				undo: 'Undo last operation',
				redo: 'Redo last operation',
				clearFormatting: 'Clear formatting',
				source: 'Show HTML source code',
			}
		};

		// Setting up configuration
		var config = $.extend({}, defaults, options);

		// Variables available for constructor
		this.textarea;

		// Common variables definition
		var $elem, $component, $input, $toolbar, $editor, $source, $link;

		// Available toolbar elements and operations binded to them
		var operations = {

			bold: {
				icon: 'Bold',
				exec: function() {
					document.execCommand('bold');
				}
			},

			clearFormatting: {
				icon: 'Clear-formatting',
				exec: function() { /* @TODO */ }
			},

			code: {
				icon: 'pre',
				exec: function() {
					document.execCommand('formatBlock', false, 'pre');
				}
			},

			h1: {
				icon: 'Header-1',
				exec: function() {
					document.execCommand('formatBlock', false, 'h1');
				}
			},

			italic: {
				icon: 'Italic',
				exec: function() {
					document.execCommand('italic');
				}
			},

			link: {
				icon: 'Link',
				exec: function() {
					$link.toggleClass(config.classNames.active);
				}
			},

			ol: {
				icon: 'Ordered-list',
				exec: function() {
					document.execCommand('insertOrderedList');
				}
			},

			redo: {
				icon: 'Redo',
				exec: function() {
					document.execCommand('redo');
				}
			},

			source: {
				icon: 'Html',
				exec: function($button) {

					// Close
					if ($button.hasClass(config.classNames.active)) {

						// Save changes
						$input.val($source.val());
						$editor.html($source.val());

						// Add/remove classes
						$source.removeClass(config.classNames.active);
						$toolbar.find('button').removeClass(config.classNames.disabled);
						$button.removeClass(config.classNames.active);
					}

					// Open
					else {
						$source.addClass(config.classNames.active);
						$toolbar.find('button').addClass(config.classNames.disabled);
						$button
							.removeClass(config.classNames.disabled)
							.addClass(config.classNames.active);
					}
				}
			},

			ul: {
				icon: 'Unordered-list',
				exec: function() {
					document.execCommand('insertUnorderedList');
				}
			},

			undo: {
				icon: 'Undo',
				exec: function() {
					document.execCommand('undo');
				}
			},

			underline: {
				icon: 'Underline',
				exec: function() {
					document.execCommand('underline');
				}
			},
		};


		/**
		 * HELPER: Create Toolbar
		 */

		this.createToolbar = function() {
			var toolbarCode = $('<div/>', {class: config.classNames.toolbar});

			for (var key in config.toolbarElements) {

				// If it is a list of buttons
				if (config.toolbarElements[key].constructor === Array) {

					/* @TODO : Finish below code
					var $subList = $('<ul/>');
					('<div class="' + config.classNames.sublist + '">' + config.lang.styles + '<ul></ul></div>');

					for (var subKey in config.toolbarElements[key]) {
						$subList.append('<li><button></button></li>');
					}
					toolbarCode.append($subList);*/
				}

				// If its regular button
				else if (operations[config.toolbarElements[key]]) {
					toolbarCode.append($('<button/>', {
						class: 'icon-' + operations[config.toolbarElements[key]].icon,
						title: config.lang[config.toolbarElements[key]],
						'data-rte-exec': config.toolbarElements[key]
					}));
				}
			}
			return toolbarCode;
		};


		/**
		 * METHOD: Create Editor
		 * @param {object} params
		 */

		this.createEditor = function(params) {

			// Component wrapper
			$component	= $('<div/>', {class: config.classNames.wrapper});

			// Component hidden input
			$input = $('<input/>', {
				type: 'hidden',
				name: params.name,
				value: params.value
			});

			// Component toolbar
			$toolbar = that.createToolbar();

			// Component editor field
			$editor = $('<p/>', {
				class: config.classNames.editor,
				contenteditable: true
			}).html(params.value);

			// Component source code
			$source = $('<textarea/>', {
				class: config.classNames.source,
				spellcheck: false
			}).html(params.value);

			// Mix wrapper and elements together and replace source textarea
			$component.append($input, $toolbar, $editor, $source);
			$elem.replaceWith($component);

			// Set two way binding on hidden input and rich text editor
			$editor.on('DOMSubtreeModified', function(event) {
				$input.val(event.currentTarget.innerHTML);
				$source.val(event.currentTarget.innerHTML);
			});

			// Handle focus on editor
			$component.on('focus blur', function(event) {
				if (event.type === 'focus') $component.addClass(config.classNames.active);
				else $component.removeClass(config.classNames.active);
			});

			// Handle clicking on toolbar button
			$toolbar.on('click', 'button', function(event) {
				event.preventDefault();

				var $this = $(this),
					exec = $this.data('rte-exec');

				// Execute operation
				if (exec && operations[exec]) operations[exec].exec($this);
			});
		};


		/**
		 * METHOD: Get Selection
		 */

		this.getSelection = function() {
			return window.getSelection ? window.getSelection() : '';
		};


		/**
		 * METHOD: Get Selection Text
		 */

		this.getSelectionText = function() {
			return that.getSelection().toString();
		};


		/**
		 * METHOD: Init
		 */

		this.init = function() {

			$elem = $(elem);
			if (!$elem.length) {
				if (config.debug) console.log('RichTextEditor: Textarea element not found');
				return false;
			}

			if ($elem.prop('nodeName') !== 'TEXTAREA') {
				if (config.debug) console.log('RichTextEditor: Element skipped: ' + $elem.prop('nodeName'));
				return false;
			}

			that.createEditor({
				name	: $elem.attr('name'),
				value	: $elem.val(),
			});

		};

		this.init();

	};


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.richTextEditor = function(options) {
		if (options && options.debug) console.log('jQ Plugin initiated: RichTextEditor. Objects found: ' + this.length);

		/* global RichTextEditor */
		this.each(function(index, elem) {
			new RichTextEditor(elem, options);
		});

		return this;
	};

})(jQuery);