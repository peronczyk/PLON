/**
 * =================================================================================
 *
 * PLON Component : Observer
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */


(function($) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug: 0,
			init: null,
			params: null,
		},
		allowedParams = ['childList', 'characterData', 'attributes', 'subtree'];


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.observer = function(options) {

		// Setup configuration
		var config		= $.extend({}, defaults, options),
			paramsSetup	= {},
			_self		= $(this),
			i			= allowedParams.length;

		if (config.debug) console.log('Plugin loaded: Observe');

		// Skip if function was initiated bad way
		if (config.init && typeof config.init !== 'function') {
			if (config.debug) console.error('Observer: variable passed as first argument was not a function');
			return _self;
		}

		// Skip if no dom elements was passed to watch
		else if (_self.length < 1) {
			if (config.debug) console.error('Observer: there is no elements to observe');
			return _self;
		}

		// Set up basic variables

		var myObserver = new MutationObserver(mutationHandler); // Mutation observer object

		// Set up configuration
		if (!config.params) {
			while (i--) paramsSetup[allowedParams[i]] = true;
		}
		else if (typeof config.params === 'object') {
			paramsSetup = config.params;
		}
		else if (typeof config.params === 'string') {
			config.params = config.params.split(' ');
			while (i--) {
				if (config.params.indexOf(allowedParams[i]) > -1) {
					paramsSetup[allowedParams[i]] = true;
				}
				else {
					paramsSetup[allowedParams[i]] = false;
				}
			}
		}

		// Add observer to all elements found in jQ
		_self.each(function() {
			if (config.debug) console.info('Observer: set to watch');
			myObserver.observe(this, paramsSetup);
		});

		// Mutation handler
		function mutationHandler(mutationRecords) {
			mutationRecords.forEach(function(mutation) {
				if (config.debug) console.info('Observer: Change in observed area detected');
				if (config.init) var initObj = config.init.call(initObj, mutation); // Call function passed as value of init object
			});
		}

		return _self;
	};

})(jQuery);