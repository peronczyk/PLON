/**
 * =================================================================================
 *
 * PLON Component : RichTextEditor
 *
 * This component replaces regular textarea with Rich Text editor, that allows for
 * simple WYSIWYG text editing.
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */

window.plon = window.plon || {};

window.plon.ScrollSpy = class {

	/** ----------------------------------------------------------------------------
	 * Construct
	 * @param {String} rteTextareaSelector
	 * @param {Object} options
	 */

	constructor(rteElemSelector, options) {

		// Default configuration values
		const defaults = {

			/**
			 * Decide if you want to show user-friendly notifications in console
			 * window of the broowser.
			 * @var {Boolean}
			 */
			debug: false,
			classNames: {
				wrapper: 'o-Rte',
				toolbar: 'o-Rte__Toolbar',
				editor: 'o-Rte__Editor',
				source: 'o-Rte__Source',
				sublist: 'o-Rte__Sublist',
				hidden: 'u-Hidden',
				active: 'is-Active',
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

		this.config = { ...defaults, ...options };
		this.textarea;

		// Available toolbar elements and operations binded to them
		this.toolbarOperations = {
			bold: {
				icon: 'Bold',
				exec: () => this.execCommand('bold'),
			},

			clearFormatting: {
				icon: 'Clear-formatting',
				exec: () => { /** @TODO */ }
			},

			code: {
				icon: 'pre',
				exec: () => this.execCommand('formatBlock', false, 'pre'),
			},

			h1: {
				icon: 'Header-1',
				exec: () => this.execCommand('formatBlock', false, 'h1'),
			},

			italic: {
				icon: 'Italic',
				exec: () => this.execCommand('italic'),
			},

			link: {
				icon: 'Link',
				exec: () => $link.toggleClass(this.config.classNames.active),
			},

			ol: {
				icon: 'Ordered-list',
				exec: () => this.execCommand('insertOrderedList'),
			},

			redo: {
				icon: 'Redo',
				exec: () => this.execCommand('redo'),
			},

			source: {
				icon: 'Html',
				exec: ($button) => {

					// Close
					if ($button.hasClass(this.config.classNames.active)) {

						// Save changes
						$input.val(this.$source.val());
						$editor.html(this.$source.val());

						// Add/remove classes
						$source.removeClass(this.config.classNames.active);
						$toolbar.find('button').removeClass(this.config.classNames.disabled);
						$button.removeClass(this.config.classNames.active);
					}

					// Open
					else {
						$source.addClass(this.config.classNames.active);
						$toolbar.find('button').addClass(this.config.classNames.disabled);
						$button
							.removeClass(this.config.classNames.disabled)
							.addClass(this.config.classNames.active);
					}
				}
			},

			ul: {
				icon: 'Unordered-list',
				exec: () => this.execCommand('insertUnorderedList'),
			},

			undo: {
				icon: 'Undo',
				exec: () => this.execCommand('undo'),
			},

			underline: {
				icon: 'Underline',
				exec: () => this.execCommand('underline'),
			},
		};

		this.$rteSourceElements = $(rteElemSelector);

		if (!this.$rteSourceElements.length < 1) {
			this.debugLog(`Textarea element not found.`, 'warn');
			return;
		}

		if (this.$rteSourceElements.prop('nodeName') !== 'TEXTAREA') {
			this.debugLog(`Element skipped: ${$elem.prop('nodeName')}`);
			return;
		}

		this.$rteSourceElements.createEditor();
	};


	/** ----------------------------------------------------------------------------
	 * Execute command
	 */

	execCommand(commandName, showDefaultUi = false, valueArgument = null) {
		let success;

		try {
			success = document.execCommand(commandName, showDefaultUi, valueArgument);
		}
		catch (error) {}

		if (!success) {
			const message = (this.isCommandSupported(commandName))
				? 'Unknown error. Is anything selected?'
				: `Browser does not support command "${commandName}".`
			this.debugLog(message);
		}
	};


	/** ----------------------------------------------------------------------------
	 * Check if provided command is supported by browser.
	 * @returns {Boolean}
	 */

	isCommandSupported(commandName) {
		return document.queryCommandSupported(commandName);
	};




	/** ----------------------------------------------------------------------------
	 * Create Toolbar
	 */

	createToolbar() {
		let toolbarCode = $('<div/>', { class: this.config.classNames.toolbar });

		this.config.toolbarElements.forEach((elementName) =>{
			let operationData = this.toolbarOperations[elementName];

			// If it is a list of buttons
			if (Array.isArray(elementName)) {

				/* @TODO : Finish below code
				var $subList = $('<ul/>');
				('<div class="' + config.classNames.sublist + '">' + config.lang.styles + '<ul></ul></div>');

				for (var subKey in config.toolbarElements[key]) {
					$subList.append('<li><button></button></li>');
				}
				toolbarCode.append($subList);*/
			}

			// If its regular button
			else if (operationData) {
				toolbarCode.append($('<button/>', {
					class: 'icon-' + operationData.icon,
					title: this.config.lang[telementName],
					'data-rte-exec': elementName
				}));
			}
		});

		return toolbarCode;
	};


	/** ----------------------------------------------------------------------------
	 * Create Editor
	 */

	createEditor() {
		let textareaName = $elem.attr('name');
		let textareaValue = $elem.val();

		// Component wrapper
		$component = $('<div/>', { class: this.config.classNames.wrapper });

		// Component hidden input
		$input = $('<input/>', {
			type: 'hidden',
			name: textareaName,
			value: textareaValue
		});

		// Component toolbar
		$toolbar = that.createToolbar();

		// Component editor field
		$editor = $('<p/>', {
			class: this.config.classNames.editor,
			contenteditable: true
		}).html(textareaValue);

		// Component source code
		$source = $('<textarea/>', {
			class: this.config.classNames.source,
			spellcheck: false
		}).html(textareaValue);

		// Mix wrapper and elements together and replace source textarea
		$component.append($input, $toolbar, $editor, $source);
		$elem.replaceWith($component);

		// Set two way binding on hidden input and rich text editor
		$editor.on('DOMSubtreeModified', (event) => {
			let inputContent = event.currentTarget.innerHTML;

			$input.val(inputContent);
			$source.val(inputContent);
		});

		// Handle focus on editor
		$component.on('focus blur', (event) => {
			$component.toggleClass(config.classNames.active, (event.type === 'focus'));
		});

		// Handle clicking on toolbar button
		$toolbar.on('click', 'button', (event) => {
			event.preventDefault();

			let $clickedButton = $(event.currentTarget);
			let execCommandName = $clickedButton.data('rte-exec');
			let operationData = this.toolbarOperations[execCommandName];

			// Execute operation
			if (execCommandName && operationData) {
				operationData.exec($clickedButton);
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * Get Selection
	 */

	getSelection() {
		return window.getSelection
			? window.getSelection()
			: '';
	};


	/** ----------------------------------------------------------------------------
	 * Get Selection Text
	 */

	getSelectionText() {
		return that.getSelection().toString();
	};


	/** ----------------------------------------------------------------------------
	 * Debug logging
	 * @var {String} message
	 * @var {String} type
	 */

	debugLog(message, type = 'info') {
		if (this.config.debug) {
			console[type]('[PLON / ScrollSpy]', message);
		}
	};
};