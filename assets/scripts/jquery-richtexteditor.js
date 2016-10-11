
/*	================================================================================
 *
 *	JQ: RICH TEXT EDITOR
 *
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	Changes simple <textarea> into full rich text editor. Allows editing
 *	content simmilar way as desktop text processors (eg.: MS Word)
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	Example: $('[data-richtext]').richTextEditor();
 *
 *	================================================================================ */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			classNames: {
				wrapper	: 'o_rte',
				toolbar	: 'o_rte__toolbar',
				editor	: 'o_rte__editor',
				hidden	: 'u_hidden',
			}
		},
		key, subKey,

		// List of available buttons in toolbar
		// All functions: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand

		toolbarButtons = [
			{label: 'Style', list: [
				{label: 'Header H1', exec: 'formatBlock', argument: 'h1'},
				{label: 'Header H2', exec: 'formatBlock', argument: 'h2'},
				{label: 'Kod', exec: 'formatBlock', argument: 'pre', title: 'Code block'}
			]},
			{label: 'B', exec: 'insertHTML', argument: '<strong>{selection}</strong>', icon: 'bold', title: 'Bold text'},
			{label: 'I', exec: 'italic', icon: 'italic', title: 'Italic text'},
			{label: 'U', exec: 'underline', icon: 'underline', title: 'Underlined text'},
			{label: 'Ul', exec: 'insertUnorderedList', icon: 'unordered-list', title: 'Unordered list'},
			{label: 'Ol', exec: 'insertOrderedList', icon: 'ordered-list', title: 'Ordered list'},
			{label: 'A', exec: 'link', icon: 'link', title: 'Link to online resource'},
			{label: 'Undo', exec: 'undo', icon: 'undo', title: 'Undo last action'},
			{label: 'Redo', exec: 'redo', icon: 'redo', title: 'Redo last action'},
			{label: 'Clear', exec: 'clearFormatting', icon: 'clear-formatting', title: 'Clear formatting'},
			{label: 'HTML', exec: 'showHTML', icon: 'html', title: 'Show HTML source'}
		];


	// Create DOM of single button basing on params received by function

	function createButton(params) {
		var str = '';

		str += '<li><button';

		if(params.exec)		str += ' data-exec="' + params.exec + '"';
		if(params.argument)	str += ' data-argument="' + params.argument + '"';
		if(params.title)	str += ' title="' + params.title + '"';
		if(params.icon)		str += ' class="icon-' + params.icon + '"';

		str += '>' + params.label + '</button></li>';
		return str;
	}


	// Get selection

	function getSelection() {
		return (window.getSelection) ? window.getSelection() : {};
	}


	// Get nodes from selection

	function getSelectedNodes() {
		var nodes = [];
		var sel = getSelection();
		for (var i = 0, len = sel.rangeCount; i < len; ++i) {
			nodes.push.apply(nodes, getRangeSelectedNodes(sel.getRangeAt(i), true));
		}
		return nodes;
	}


	// Get selection text

	function getSelectionText() {
		return getSelection().toString();
	}


	// Clear formatting

	function clearFormatting() {}


	/*	--------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.richTextEditor = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			_self = $(this);


		// Loop over all found textareas

		_self.each(function() {

			// Skip this element if it's not a textarea

			if ($(this).prop('nodeName') !== 'TEXTAREA') {
				if (debug) console.log('RTE: Element skiped: ' + $(this).prop('nodeName'));
				return true;
			}

			/*	--------------------------------------------------------------------
			 *	REPLACE TEXTAREA WITH RICH TEXT EDITOR
			 */

			// Set starting params

			var $element = $(this),
				textarea = {
					name	: $element.attr('name'),
					value	: $element.val(),
					width	: ($element[0].style.width)  ? $element[0].style.width  : $element.width(), // Try to get uncomputed width
					height	: ($element[0].style.height) ? $element[0].style.height : $element.height(), // Try to get uncomputed height
				};

			// Start replacing textarea with editor code

			var editorCode = $('<div/>', { class: config.classNames.wrapper});

			editorCode
				.append($('<input/>', {type: 'hidden', name: textarea.name, value: textarea.value}))
				.append($('<ul/>', {class: config.classNames.toolbar}))
				.append($('<div/>', {class: config.classNames.editor, contenteditable: true}));

			$(this).replaceWith(editorCode);

			var $input		= editorCode.children('input'),
				$toolbar	= editorCode.children('.' + config.classNames.toolbar),
				$editor		= editorCode.children('.' + config.classNames.editor);

			$editor.html(textarea.value);

			// Set two way binding on hidden input and rich text editor
			// To achive this Mutation Observers are used instead of Mutation Events (eg.: .on('DOMSubtreeModified'))

			$editor.on('DOMSubtreeModified', function(e) {
				$input.val(e.currentTarget.innerHTML);
			});


			/*	--------------------------------------------------------------------
			*	PREPARE TOOLBAR
			*/

			for(key in toolbarButtons) {

				var appendStr = '';

				// If it is a list of buttons

				if(toolbarButtons[key].list && typeof(toolbarButtons[key].list) === 'object') {
					appendStr += '<li><button data-exec="toggle" class="sublist">' + toolbarButtons[key].label + '</button><ul class="' + config.classNames.hidden + '">';

					for(subKey in toolbarButtons[key].list) {
						appendStr += createButton(toolbarButtons[key].list[subKey]);
					}

					appendStr += '</ul></li>';
				}

				// If its regular button

				else appendStr += createButton(toolbarButtons[key]);

				$toolbar.append(appendStr);
			}


			/*	--------------------------------------------------------------------
			*	TOOLBAR BUTTON CLICK
			*/

			$toolbar.on('click', 'button', function(event) {
				var exec = $(this).data('exec');

				switch(exec) {
					case 'toggle':
						$(this).next().toggleClass(config.classNames.hidden);
						if (debug) console.log('Button clicked to toggle submenu');
						break;

					case 'showHTML':
						if (debug) console.log('Button clicked with function "showHTML"');
						break;

					case 'clearFormatting':
						clearFormatting();
						break;

					default:
						var argument = ($(this).data('argument')) ? $(this).data('argument').replace('{selection}', getSelectionText()) : null;
						document.execCommand(exec, false, argument);
						$toolbar.find('ul').addClass('hidden');
						if (debug) console.log('Button clicked with function: ' + exec + ' and argument: ' + argument);
				}

				return false;
			});


			/*	--------------------------------------------------------------------
			*	HANDLE FOCUS OF EDITOR
			*/

			$editor.on('focus blur', function(e) {
				(e.type == 'focus') ? editorCode.addClass('active') : editorCode.removeClass('active');
			});
		});
	}

})(jQuery);