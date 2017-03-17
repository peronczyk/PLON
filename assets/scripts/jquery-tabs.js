/*
	global jQuery
*/

(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *
	 */

	var Tabs = function(options, elem) {

		// Default configuration
		var defaults = {
			debug: 0,
			tabSelector		: '[role="tab"]',
			panelSelector	: '[role="tabpanel"]',
			eventsNamespace	: '.plon.tabs',
			dataBinder		: 'data-tabs-panels',
		};

		// Setting instance configuration
		var config = $.extend({}, defaults, options);

		// Common variables definition
		var panelsId, $panelContainer, $panelList,
			$tabContainer, $tabList,
			activeTabNumber;

		// jQ shortcuts
		var $document = $(document);

		// Events monitored by script
		var monitoredEvents =
			' click' + config.eventsNamespace +
			' focusin' + config.eventsNamespace +
			' focusout' + config.eventsNamespace;

		var changeTab = function(newTabNumber) {
			console.log(newTabNumber);
			if (newTabNumber > $panelList.length - 1 || newTabNumber < 0) {
				console.warn('Tabs: Tab with index "' + newTabNumber + '" doesn\'t exist');
				return false;
			}

			console.log($panelList);
		};

		var nextTab = function() {
			console.log('Next');
			var newTabNumber = activeTabNumber === $tabList.length - 1 ? 0 : activeTabNumber + 1;
			changeTab(newTabNumber);
		};

		var previousTab = function() {
			console.log('Previous');
			var newTabNumber = activeTabNumber <= 0 ? $tabList.length - 1 : activeTabNumber - 1;
			changeTab(newTabNumber);
		};

		var bindKeyboardNav = function() {
			$document.on('keydown' + config.eventsNamespace, function(event) {
				switch (event.which) {
					case '37': // Arrow left
					case '38': // Arrow up
						event.preventDefault();
						nextTab();
						break;

					case '39': // Arrow right
					case '40': // Arrow down
						event.preventDefault();
						previousTab();
						break;
				}
			});
		};

		var unbindKeyboardNav = function() {
			$document.off(config.eventsNamespace);
		};

		$tabContainer = $(elem);
		if (!$tabContainer.length) {
			console.warn('TabList container not found');
			return false;
		}

		$tabList = $tabContainer.find(config.tabSelector);
		if (!$tabList.length) {
			console.warn('No tabs found');
			return false;
		}

		panelsId = $tabContainer.attr(config.dataBinder);
		if (typeof panelsId === 'undefined' || panelsId === false) {
			var $elemWithBindingId = $tabContainer.closest('[' + config.dataBinder + ']');
			if ($elemWithBindingId.length) {
				panelsId = $elemWithBindingId.attr(config.dataBinder);
			}
			else {
				console.warn('Tabs: Selected tabs list container or any parent element doesn\'t have data selector (' + config.dataBinder + ') or it\'s empty: "' + panelsId + '"');
				return false;
			}
		}

		$panelContainer = $('#' + panelsId);
		if (!$panelContainer) {
			if (config.debug) console.warn('Tabs: Specified panels container doesn\'t exist: ' + panelsId);
			return false;
		}

		$panelList = $panelContainer.children(config.panelSelector);

		$tabList.on(monitoredEvents, function(event) {
			switch (event.type) {
				case 'click':
					changeTab($(this).index());
					break;

				case 'focusin':
					bindKeyboardNav();
					break;

				case 'focusout':
					unbindKeyboardNav();
					break;
			}
		});
	};


	/*	----------------------------------------------------------------------------
	 *	JQ PLUGIN
	 */

	$.fn.tabs = function(options) {
		console.log('Plugin initiated: Tabs');
		$(this).each(function(index, elem) {
			new Tabs(options, elem);
		});
	};

})(jQuery);