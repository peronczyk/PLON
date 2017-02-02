/*
 *	================================================================================
 *
 *	JQ: SOCIAL FEED
 *
 *	Script author: Bartosz Perończyk (peronczyk.com)
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *
 *
 *	--------------------------------------------------------------------------------
 *	TODO
 *
 *
 *
 *	================================================================================
 */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			'debug': 0,

			// Service type (facebook, twitter, youtube)
			'service': null,

			// Node ID of facebook page
			'sourceID': null,

			// Access token
			// Generated per persona or per app (app_id|access_code)
			'accessToken': null,

			// List of variables that describes each post
			'fields': null,

			// How many posts will be received
			'postsPerPage': 4,

			// Class name or ID of entry
			'entryElem': null,

			// Data attribute name that connects element with text that should be
			// inserted to it
			'entryElementsSelector': 'data-entry-element',

			// Class name or ID of previous button
			'btnPrevious': null,

			// Class name or ID of next button
			'btnNext': null,

			// Predefined class names for script states
			// They are added to selected wrapper element when script loads data
			'loadedClassName'		: 'is-Loaded',
			'errorClassName'		: 'is-Error',
			'hasNextClassName'		: 'has-Next',
			'hasPreviousClassName'	: 'has-Previous',
		};


	/*	----------------------------------------------------------------------------
	 *	SERVICES CONFIGURATION AND METHODS
	 *
	 *	@url - API endpoint URL
	 *	@defaultFields - String that contains list of variables to be received with
	 *		each of feed posts (eg.: title, photo, date, etc)
	 *	@getDataValues - Method that return universal element names
	 *		with parsed values bind to them
	 */

	var services = {

			// Facebook API
			'facebook': {
				'url': 'https://graph.facebook.com/v2.8/{sourceID}/posts?fields={fields}&limit={postsPerPage}&access_token={accessToken}',
				'defaultFields': 'message,created_time,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',
				'dataVariable': 'data',
				'getDataValues': function(receivedData) {
					if (!receivedData.data || receivedData.data.length < 1) return false;
					var values = [];
					for (var index in receivedData.data) {
						values[index] = {
							'link'		: receivedData.data[index].permalink_url,
							'date'		: formatDate(receivedData.data[index].created_time),
							'cover'		: receivedData.data[index].full_picture,
							'text'		: receivedData.data[index].message,
							'likes'		: (receivedData.data[index].likes) ? receivedData.data[index].likes.summary.total_count : 0,
							'comments'	: (receivedData.data[index].comments) ? receivedData.data[index].comments.summary.total_count : 0
						};
					};
					return values;
				},
			},

			// YouTube API
			'youtube': {
				'url': 'https://www.googleapis.com/youtube/v3/search?channelId={sourceID}&order=date&part={fields}&maxResults={postsPerPage}&key={accessToken}',
				'defaultFields': 'snippet',
				'getDataValues': function(receivedData) {
					if (!receivedData.items || receivedData.items.length < 1) return false;
					return [];
				}
			},

			'twitter': {
				'url': 'https://api.twitter.com/1.1/'
			}
		};

	var prepareUrl = function(config) {
		return services[config.service].url
			.replace('{sourceID}', config.sourceID)
			.replace('{accessToken}', config.accessToken)
			.replace('{fields}', (config.fields) ? config.fields : services[config.service].defaultFields)
			.replace('{postsPerPage}', config.postsPerPage);
	}

	// Get DOM entry element and search child elements specified by data selector
	var prepareEntryElements = function($entry, selector) {
		var entryElements = [];
		$entry.find('[' + selector + ']').each(function(i, elem) {
			entryElements[$(this).attr(selector)] = $(this);
		});
		return entryElements;
	}

	// Format date: YYYY-MM-DD HH:MM
	var formatDate = function(date) {
		var date = new Date(date);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
	}


	/*	----------------------------------------------------------------------------
	 *	GET FEED ENTRIES
	 */

	var getFeedEntries = function(config, $entriesWrapper, $entry, entryElements) {
		var preparedUrl = prepareUrl(config),
			result = $.ajax({
				'url': preparedUrl
			});

		result.then(

			// Success
			function(data, textStatus, jqXHR) {
				if (config.debug) console.log('socialFeed: Data received succesully from: ' + preparedUrl);

				var dataValues = services[config.service].getDataValues(jqXHR.responseJSON);

				if (dataValues === false) {
					if (config.debug) console.warn('socialFeed: Could not process received data. Data is empty or broken.');
					return;
				}

				// Prepare entries and insert them into entries wrapper
				for (var index in dataValues) {
					for (var type in entryElements) {
						if (dataValues[index][type]) {
							if (entryElements[type].is('a'))
								entryElements[type].attr('href', dataValues[index][type]);

							else if (entryElements[type].is('img'))
								entryElements[type].attr('src', dataValues[index][type]);

							else entryElements[type].html(dataValues[index][type]);
						}
					}
					$entriesWrapper.append($entry.clone());
				};
			},

			// Error
			function(test) {
				console.log('ERROR');
				console.log(test);
			}
		);
	}


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.socialFeed = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			$self = $(this);

		if (config.debug) console.info('Plugin loaded: socialFeed [' + config.service + ']');

		if (!config.service || !services[config.service]) {
			if (config.debug) console.warn('socialFeed: Selected service "' + config.service + '" is not supported');
			return;
		}

		if ($self.length < 1) {
			if (config.debug) console.warn('socialFeed: Wrapper element not found');
			return;
		}

		var $entry = $self.find(config.entryElem),
			$entriesWrapper = $entry.parent(),
			entryElements = prepareEntryElements($entry, config.entryElementsSelector);

		$entry.detach();

		getFeedEntries(config, $entriesWrapper, $entry, entryElements);

		return $self;
	}



})(jQuery);