
/*	================================================================================
 *
 *	SOCIAL FEED COMPONENT
 *
 *	Modified		: 2017-04-04
 *	Author			: Bartosz Perończyk (peronczyk.com)
 *	Repository		: https://github.com/peronczyk/plon
 *
 *	================================================================================
 */


window.SocialFeed = function(options) {

	'use strict';

	/** ----------------------------------------------------------------------------
	 * DEFINITIONS
	 */

	var that = this;

	// Default configuration
	var defaults =
		{
			debug: 0,

			// CSS selector for entries list wrapper
			wrapperElem: null,

			// Class name or ID of entry
			entryElem: null,

			// Service type (facebook or youtube)
			service: null,

			// Node ID of social page
			// eg.: http://facebook.com/sourceid
			sourceId: null,

			// Access token
			// Generated per persona or per app. Check API documentation.
			accessToken: null,

			// List of variables that describes each post
			fields: null,

			// How many posts will be received
			postsPerPage: 4,

			// Data attribute name that connects element with text that should be
			// inserted to it
			entryElementsSelector: 'data-entry-element',

			// Class name or ID of previous button
			btnPrevious: null,

			// Class name or ID of next button
			btnNext: null,

			// Predefined class names for script states
			// They are added to selected wrapper element when script loads data
			classNames: {
				loading		: 'is-Loading',
				loaded		: 'is-Loaded',
				error		: 'is-Error',
				hasNext		: 'has-Next',
				hasPrev		: 'has-Prev',
				disabled	: 'u-Disabled',
			}
		};

	// Common variables definition
	var config,
		$wrapper, $entry, $entriesWrapper,
		$navigation = {},
		entryElements,
		pageNum = 0, // Points to loaded entries page
		baseUrl,
		nextUrl,
		prevUrl;


	/** ----------------------------------------------------------------------------
	 * DATE FORMATTING HELPER
	 * Format: YYYY-MM-DD HH:MM
	 */

	var formatDate = function(sourceDate) {
		var date = new Date(sourceDate);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
	};


	/** ----------------------------------------------------------------------------
	 *	SERVICES CONFIGURATION AND METHODS
	 *
	 * url - API endpoint URL
	 * defaultFields - String that contains list of variables to be received with
	 *		each of feed posts (eg.: title, photo, date, etc). More info are
	 *		available in API documentation.
	 * getDataValues - Method that return universal element names
	 *		with parsed values bind to them
	 */

	var services =
		{

			// Facebook API

			facebook: {
				defaultFields: 'message,created_time,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',
				dataVariable: 'data',

				url: function() {
					return 'https://graph.facebook.com/v2.8/' + config.sourceId + '/posts?fields=' + this.defaultFields + '&limit=' + config.postsPerPage + '&access_token=' + config.accessToken;
				},

				urlPrev: function(receivedData) {
					return receivedData.paging.next ? receivedData.paging.next : false;
				},

				urlNext: function(receivedData) {
					return receivedData.paging.previous ? receivedData.paging.previous : false;
				},

				getDataValues: function(receivedData) {
					var values = [];
					if (receivedData.data) {
						var feedList = receivedData.data;
						for (var i in feedList) {
							values[i] = {
								link		: feedList[i].permalink_url,
								date		: formatDate(feedList[i].created_time),
								image		: feedList[i].full_picture,
								text		: feedList[i].message,
								likes		: feedList[i].likes ? feedList[i].likes.summary.total_count : 0,
								comments	: feedList[i].comments ? feedList[i].comments.summary.total_count : 0
							};
						}
					}
					return values;
				},
			},


			// YouTube API

			youtube: {
				defaultFields: 'snippet',

				url: function() {
					return 'https://www.googleapis.com/youtube/v3/search?channelId=' + config.sourceId + '&order=date&part=' + this.defaultFields + '&maxResults=' + config.postsPerPage + '&key=' + config.accessToken;
				},

				urlPrev: function(receivedData) {
					if (receivedData.nextPageToken) {
						return this.url(config) + '&pageToken=' + receivedData.nextPageToken;
					}
					else return false;
				},

				urlNext: function(receivedData) {
					if (receivedData.prevPageToken) {
						return this.url(config) + '&pageToken=' + receivedData.prevPageToken;
					}
					else return false;
				},

				getDataValues: function(receivedData) {
					var values = [];
					if (receivedData.items) {
						var feedList = receivedData.items;
						for (var i in feedList) {
							values[i] = {
								link	: 'https://youtu.be/' + feedList[i].id.videoId,
								image	: feedList[i].snippet.thumbnails.high.url,
								text	: feedList[i].snippet.title,
							};
						}
					}
					return values;
				},
			}
		};


	/** ----------------------------------------------------------------------------
	 * PREPARE FEED ENTRY ELEMENTS
	 * Get DOM entry element and search child elements specified by data selector
	 * @returns {array}
	 */

	var prepareEntryElements = function() {
		var entryElements = [];
		$entry.find('[' + config.entryElementsSelector + ']').each(function() {
			entryElements[$(this).attr(config.entryElementsSelector)] = $(this);
		});
		return entryElements;
	};


	/** ----------------------------------------------------------------------------
	 * SET VALUE TO ENTRY ELEMENT
	 */

	var setEntryElementValue = function($elem, value) {
		switch ($elem.prop('nodeName')) {
			case 'A':
				value ? $elem.attr('href', value).show() : $elem.attr('href', '').hide();
				break;

			case 'IMG':
				value ? $elem.attr('src', value).show() : $elem.attr('src', '').hide();
				break;

			default:
				$elem.html(value);
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Get Feed Entries
	 */

	this.loadEntries = function(url) {
		$wrapper.addClass(config.classNames.loading);

		$.ajax({url: url}).then(

			// Success
			function(data, textStatus, jqXHR) {
				if (config.debug) console.log('socialFeed: Data received succesully from: ' + url);

				var dataValues = services[config.service].getDataValues(jqXHR.responseJSON);

				if (dataValues.length < 1) {
					if (config.debug) console.warn('socialFeed [' + config.service + ']: Could not process received data. Data is empty or broken.');
					return;
				}

				$entriesWrapper.empty();

				$wrapper
					.removeClass(config.classNames.loading)
					.addClass(config.classNames.loaded);

				// Prepare entries and insert them into entries wrapper
				for (var index in dataValues) {
					for (var type in entryElements) {
						setEntryElementValue(entryElements[type], dataValues[index][type]);
					}
					$entriesWrapper.append($entry.clone());
				}

				prevUrl = services[config.service].prevUrl(config, jqXHR.responseJSON);
				nextUrl = services[config.service].nextUrl(config, jqXHR.responseJSON);

				// Check if there are previous page of feed
				if (prevUrl) $wrapper.addClass(config.classNames.hasPrev);
				else $wrapper.removeClass(config.classNames.hasPrev);

				// Check if there are next page of feed
				if (nextUrl && pageNum > 0) $wrapper.addClass(config.classNames.hasNext);
				else $wrapper.removeClass(config.classNames.hasNext);

			},

			// Error
			function(jqXHR, textStatus, errorThrown) {
				$wrapper
					.removeClass(config.classNames.loading)
					.addClass(config.classNames.error);

				if (config.debug) {
					console.warn('socialFeed: Request to ' + preparedUrl + ' ended with error: ' + errorThrown);
					if (jqXHR.responseJSON) console.log(jqXHR.responseJSON);
				}
			}
		);
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Place Feed Entries
	 */

	this.placeEntries = function() {
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Previous Page
	 * @return {string} previous page URL
	 */

	this.previousPage = function() {
		if (config.debug) console.info('socialFeed: Previous next clicked');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Next Page
	 * @return {string} next page URL
	 */

	this.nextPage = function() {
		if (config.debug) console.info('socialFeed: Button next clicked');
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Handle Nav Button
	 * @return {string} type (prev / next)
	 */

	this.handleNavButton = function(btnType) {
		$navigation[btnType] = $wrapper.find(config.btnPrevious);

		if (!$navigation[btnType].length) {
			console.warn('socialFeed: Button "' + btnType + '" was set but not found in document');
			delete $navigation[btnType];
			return false;
		}

		$navigation[btnType].on('click.plon.socialfeed', function(event) {
			event.preventDefault();

			if (href.length > 2) {
				if (btnType === 'previous') pageNum++;
				else if (btnType === 'next' && pageNum > 0) pageNum--;

				that.loadEntries();
				if (config.debug) console.info('socialFeed: Button "' + btnType + '" clicked');
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Init
	 */

	this.init = function() {

		// Setup configuration
		config = $.extend({}, defaults, options);

		// Definitions
		$wrapper = $(this);

		if (!config.service || !services[config.service]) {
			if (config.debug) console.warn('socialFeed: Selected service "' + config.service + '" is not supported');
			return false;
		}

		if (!config.wrapperElem || !config.entryElem) {
			if (config.debug) console.warn('socialFeed: Wrapper element selector or entry element selector not provided');
			return false;
		}

		$wrapper = $(config.wrapperElem);

		if ($wrapper.length < 1) {
			if (config.debug) console.warn('socialFeed: Wrapper element not found');
			return false;
		}

		$entry = $wrapper.find(config.entryElem);

		if ($entry.length < 1) {
			if (config.debug) console.warn('socialFeed: Entry element not found in wrapper');
			return false;
		}

		$entriesWrapper = $entry.parent();
		entryElements = prepareEntryElements();

		$entry.detach();

		baseUrl = services[config.service].url();

		that.loadEntries(baseUrl);

		// Handle navigation buttons
		if (config.btnPrevious) that.handleNavButton('previous');
		if (config.btnNext) that.handleNavButton('next');
	};


	/** ----------------------------------------------------------------------------
	 * INITIATE COMPONENT
	 */

	if (this.init() && config.debug) console.info('[PLON] SocialFeed initiated');
};