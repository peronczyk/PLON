
/*	================================================================================
 *
 *	JQ: TABS
 *
 *	Modified		: 2017-08-18
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


(function($) {

	'use strict';

	// jQ shortcuts
	var $document = $(document);


	/*	----------------------------------------------------------------------------
	 *	GLOBAL CONSTRUCTOR FOR COMPONENT
	 */

	window.Tabs = function(elem, options) {

		var that = this;

		// Default configuration
		var defaults = {
			debug				: false,
			tabSelector			: '[role="tab"]',
			panelSelector		: '[role="tabpanel"]',
			eventsNamespace		: '.plon.tabs',
			dataBinder			: 'data-tabs-panels',
			classNames			: {active: 'is-Active'},
			autoActivateTab		: 0, // 0 means first tab
		};

		// Setting instance configuration
		var config = $.extend({}, defaults, options);

		// Variables available for constructor
		this.activeTabIndex = null;
		this.panelsId;

		// Common variables definitions
		var $tabsContainer = $(elem),
			$tabsList,
			$panelsContainer,
			$panelsList,
			$activeTab,
			$activePanel;

		// Events monitored by script
		var monitoredEvents =
			' click' + config.eventsNamespace +
			' focusin' + config.eventsNamespace +
			' focusout' + config.eventsNamespace;


		/**
		 * METHOD:
		 * Change Tab
		 * @param {number} newTabIndex
		 */

		this.changeTab = function(newTabIndex) {
			if (newTabIndex > $panelsList.length - 1 || newTabIndex < 0) {
				if (config.debug) console.warn('[PLON / Tabs] Tabs panel with index "' + newTabIndex + '" doesn\'t exist');
				return false;
			}

			$tabsList
				.removeClass(config.classNames.active)
				.attr('tabindex', -1);

			$activeTab = $tabsList.eq(newTabIndex);
			$activeTab
				.addClass(config.classNames.active)
				.attr('tabindex', 0)
				.trigger('focus', {selfInitiated: true});

			$panelsList
				.removeClass(config.classNames.active)
				.attr('aria-hidden', true);

			$activePanel = $panelsList.eq(newTabIndex);
			$activePanel
				.addClass(config.classNames.active)
				.attr('aria-hidden', false);

			// Trigger catchable event
			$tabsContainer.add($panelsContainer).trigger({
				type: 'change.tabs.plon',
				oldTabIndex: that.activeTabIndex,
				newTabIndex: newTabIndex,
				tab: $activeTab,
				panel: $activePanel
			});

			that.activeTabIndex = newTabIndex;

			if (config.debug) console.log('[PLON / Tabs] Switched to tab with index: ' + newTabIndex);
		};


		/**
		 * METHOD:
		 * Naxt Tab
		 */

		this.nextTab = function() {
			var newTabIndex = 0;
			if (that.activeTabIndex !== null) {
				newTabIndex = that.activeTabIndex === $tabsList.length - 1 ? 0 : that.activeTabIndex + 1;
			}
			if (config.debug) console.log('[PLON / Tabs] Switching to next tab (index: ' + newTabIndex + ')');
			that.changeTab(newTabIndex);
		};


		/**
		 * METHOD:
		 * Previous Tab
		 */

		this.previousTab = function() {
			var newTabIndex = that.activeTabIndex <= 0 ? $tabsList.length - 1 : that.activeTabIndex - 1;
			if (config.debug) console.log('[PLON / Tabs] Switching to previous tab (index: ' + newTabIndex + ')');
			that.changeTab(newTabIndex);
		};


		/**
		 * METHOD:
		 * Bind Keyboard Nav
		 */

		this.bindKeyboardNav = function() {
			$document.on('keydown' + config.eventsNamespace, function(event) {
				switch (event.which) {
					case 32: // Space
						event.preventDefault();
						that.changeTab($(event.target).index());
						break;

					case 37: // Arrow left
					case 38: // Arrow up
						event.preventDefault();
						that.previousTab();
						break;

					case 39: // Arrow right
					case 40: // Arrow down
						event.preventDefault();
						that.nextTab();
						break;
				}
			});
		};


		/**
		 * METHOD:
		 * Unbind Keyboard Nav
		 */

		this.unbindKeyboardNav = function() {
			$document.off(config.eventsNamespace);
		};


		/**
		 * Component installation verification
		 */

		if (!$tabsContainer.length) {
			if (config.debug) console.warn('[PLON / Tabs] TabList container not found: ' + elem);
			return false;
		}

		$tabsList = $tabsContainer.find(config.tabSelector);
		if (!$tabsList.length) {
			if (config.debug) console.warn('[PLON / Tabs] No tabs found');
			return false;
		}

		that.panelsId = $tabsContainer.attr(config.dataBinder);
		if (typeof that.panelsId === 'undefined' || that.panelsId === false) {
			var $elemWithBindingId = $tabsContainer.closest('[' + config.dataBinder + ']');
			if ($elemWithBindingId.length) {
				that.panelsId = $elemWithBindingId.attr(config.dataBinder);
			}
			else {
				if (config.debug) console.warn('[PLON / Tabs] Selected tabs list container or any parent element doesn\'t have data selector (' + config.dataBinder + ') or it\'s empty: "' + that.panelsId + '"');
				return false;
			}
		}

		$panelsContainer = $('#' + that.panelsId);
		if (!$panelsContainer) {
			if (config.debug) console.warn('[PLON / Tabs] Specified panels container doesn\'t exist: ' + that.panelsId);
			return false;
		}

		$panelsList = $panelsContainer.children(config.panelSelector);
		that.activeTabIndex = $tabsContainer.find('.' + config.classNames.active).index();


		/**
		 * Events monitoring
		 */

		$tabsList.on(monitoredEvents, function(event, params) {
			if (event.type === 'click') that.changeTab($(this).index());

			// Turn ON or OFF keyboard monitoring
			// if event wasn't triggered by this component
			if (!params || !params.selfInitiated) {
				if (event.type === 'focusin') that.bindKeyboardNav();
				else if (event.type === 'focusout') that.unbindKeyboardNav();
			}
		});

		/**
		 * Auto activating first tab if none of tabs are active
		 */

		if (config.autoActivateTab !== false && $.isNumeric(config.autoActivateTab) && that.activeTabIndex === -1) {
			that.changeTab(config.autoActivateTab);
		}
	};


	/*	----------------------------------------------------------------------------
	 *	JQ PLUGIN
	 */

	$.fn.tabs = function(options) {
		if (options.debug) console.log('[PLON] Tabs initiated. Objects found: ' + this.length);

		/* global Tabs */
		this.each(function(index, elem) {
			new Tabs(elem, options);
		});

		return this;
	};

})(jQuery);