
/*	================================================================================
 *
 *	JQ: RICH TEXT EDITOR
 *
 *	Modified		: 2017-03-14
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/Streamline
 *
 *	================================================================================
 */

/*
	global jQuery
*/


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug: 0,
			classNames: {
				wrapper	: 'o-Rte',
				toolbar	: 'o-Rte__toolbar',
				editor	: 'o-Rte__editor',
				hidden	: 'u-Hidden',
				active	: 'is-Active',
			},
			lang: {
				styles: 'Styles',
				h1: 'Header level 1',
				h2: 'Header level 2',
				code: 'Code block',
				bold: 'Bold text',
				italic: 'Italic text',
				underline: 'Underlined text',
				unorderedList: 'Unordered list',
				orderedList: 'Ordered list',
				link: 'Link to online resource',
				undo: 'Undo last operation',
				redo: 'Redo last operation',
				clearFormatting: 'Clear formatting',
				htmlSource: 'Show HTML source code',
			}
		},
		key, subKey;


	/*	--------------------------------------------------------------------
	 *	METHOD: Create Button
	 *	Create DOM of single button basing on params received by function
	 */

	var createButton = function(params) {
		var str = '';

		str += '<li><button';

		if (params.exec)		str += ' data-exec="' + params.exec + '"';
		if (params.argument)	str += ' data-argument="' + params.argument + '"';
		if (params.title)		str += ' title="' + params.title + '"';
		if (params.icon)		str += ' class="icon-' + params.icon + '"';

		str += '>' + params.label + '</button></li>';
		return str;
	};


	/*	--------------------------------------------------------------------
	 *	METHOD: Get selection
	 */

	var getSelection = function() {
		return window.getSelection ? window.getSelection() : {};
	};


	/*	--------------------------------------------------------------------
	 *	METHOD: Get selection text
	 */

	var getSelectionText = function() {
		return getSelection().toString();
	};


	/*	--------------------------------------------------------------------
	 *	METHOD: Clear formatting
	 */

	var clearFormatting = function() {};


	/*	--------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.richTextEditor = function(options) {

		// Setup configuration
		var config = $.extend({}, defaults, options);

		// Definitions
		var $that = $(this);

		if (config.debug) console.info('Plugin loaded: richTextEditor (RTE)');

		if (!$that.length) {
			if (config.debug) console.warn('RTE: No richtext elements found');
			return true;
		}

		// List of available buttons in toolbar
		// All functions: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
		var toolbarButtons = [
			{
				label: config.lang.styles,
				list: [
					{label: 'Header H1', exec: 'formatBlock', argument: 'h1', title: config.lang.h1},
					{label: 'Header H2', exec: 'formatBlock', argument: 'h2', title: config.lang.h2},
					{label: 'Kod', exec: 'formatBlock', argument: 'pre', title: config.lang.code}
				]
			},
			{label: 'B', exec: 'insertHTML', argument: '<strong>{selection}</strong>', icon: 'Bold', title: config.lang.bold},
			{label: 'I', exec: 'italic', icon: 'Italic', title: config.lang.italic},
			{label: 'U', exec: 'underline', icon: 'Underline', title: config.lang.underline},
			{label: 'Ul', exec: 'insertUnorderedList', icon: 'Unordered-list', title: config.lang.unorderedList},
			{label: 'Ol', exec: 'insertOrderedList', icon: 'Ordered-list', title: config.lang.orderedList},
			{label: 'A', exec: 'link', icon: 'Link', title: config.lang.link},
			{label: 'Undo', exec: 'undo', icon: 'Undo', title: config.lang.undo},
			{label: 'Redo', exec: 'redo', icon: 'Redo', title: config.lang.redo},
			{label: 'Clear', exec: 'clearFormatting', icon: 'Clear-formatting', title: config.lang.clearFormatting},
			{label: 'HTML', exec: 'showHTML', icon: 'Html', title: config.lang.htmlSource}
		];

		// Loop over all found textareas
		$that.each(function() {
			var $this = $(this);

			// Skip this element if it's not a textarea
			if ($this.prop('nodeName') !== 'TEXTAREA') {
				if (config.debug) console.log('RTE: Element skiped: ' + $this.prop('nodeName'));
				return true;
			}

			// Set starting params for textarea replacement
			var	textarea =
				{
					name	: $this.attr('name'),
					value	: $this.val(),
					width	: $this[0].style.width ? $this[0].style.width : $this.width(), // Try to get uncomputed width
					height	: $this[0].style.height ? $this[0].style.height : $this.height(), // Try to get uncomputed height
				};

			// Start replacing textarea with ew editor code
			var editorCode = $('<div/>', {class: config.classNames.wrapper});

			editorCode
				.append($('<input/>', {type: 'hidden', name: textarea.name, value: textarea.value}))
				.append($('<ul/>', {class: config.classNames.toolbar}))
				.append($('<div/>', {class: config.classNames.editor, contenteditable: true}));

			$this.replaceWith(editorCode);

			var $input		= editorCode.children('input'),
				$toolbar	= editorCode.children('.' + config.classNames.toolbar),
				$editor		= editorCode.children('.' + config.classNames.editor);

			$editor.html(textarea.value);

			// Set two way binding on hidden input and rich text editor
			// To achive this Mutation Observers are used instead of Mutation Events

			$editor.on('DOMSubtreeModified', function(event) {
				$input.val(event.currentTarget.innerHTML);
			});

			// Prepare toolbar
			for (key in toolbarButtons) {
				var appendStr = '';

				// If it is a list of buttons
				if (toolbarButtons[key].list && typeof toolbarButtons[key].list === 'object') {
					appendStr += '<li><button data-exec="toggle" class="sublist">' + toolbarButtons[key].label + '</button><ul class="' + config.classNames.hidden + '">';

					for (subKey in toolbarButtons[key].list) {
						appendStr += createButton(toolbarButtons[key].list[subKey]);
					}

					appendStr += '</ul></li>';
				}

				// If its regular button
				else appendStr += createButton(toolbarButtons[key]);

				$toolbar.append(appendStr);
			}


			// Handle clicking on toolbar button

			$toolbar.on('click', 'button', function() {
				var $this = $(this),
					exec = $this.data('exec');

				switch (exec) {
					case 'toggle':
						$this.next().toggleClass(config.classNames.hidden);
						if (config.debug) console.log('RTE: Button clicked to toggle submenu');
						break;

					case 'showHTML':
						if (config.debug) console.log('RTE: Button clicked with function "showHTML"');
						break;

					case 'clearFormatting':
						clearFormatting();
						break;

					default:
						var argument = $this.data('argument') ? $this.data('argument').replace('{selection}', getSelectionText()) : null;
						document.execCommand(exec, false, argument);
						$toolbar.find('ul').addClass('hidden');
						if (config.debug) console.log('RTE: Button clicked with function: ' + exec + ' and argument: ' + argument);
				}

				return false;
			});


			// Handle focus on editor

			$editor.on('focus blur', function(event) {
				if (event.type === 'focus') editorCode.addClass(config.classNames.active);
				else editorCode.removeClass(config.classNames.active);
			});
		});

		return $that;
	};

})(jQuery);