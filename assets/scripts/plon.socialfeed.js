/**
 * =================================================================================
 *
 * PLON Component : SocialFeed
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
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
				hasPrevious	: 'has-Previous',
				empty		: 'is-Empty'
			}
		};

	this.pageNum = 0; // Points to loaded entries page
	this.service = null; // Link to chosen service

	// Common variables definition
	var config,
		$wrapper, $entry, $entriesWrapper,
		$navigation = {}, // Previous and next buttons
		entryElements = [],
		baseApiUrl, // API base url
		nextPageApiUrl,
		previousPageApiUrl;


	/** ----------------------------------------------------------------------------
	 * DATE FORMATTING HELPER
	 * Format: YYYY-MM-DD, HH:MM
	 * @param {string} sourceDate
	 */

	this.formatDate = function(sourceDate) {
		var date = new Date(sourceDate),
			dateFormatted;

		dateFormatted = date.getFullYear();
		dateFormatted += '-' + ('0' + (date.getMonth() + 1)).slice(-2);
		dateFormatted += '-' + ('0' + date.getDate()).slice(-2);
		dateFormatted += ', ' + ('0' + date.getHours()).slice(-2);
		dateFormatted += ':' + ('0' + date.getMinutes()).slice(-2);

		return dateFormatted;
	};


	/** ----------------------------------------------------------------------------
	 *	SERVICES CONFIGURATION AND METHODS
	 *
	 * defaultFields - String that contains list of variables to be received with
	 *		each of feed posts (eg.: title, photo, date, etc). More info are
	 *		available in API documentation.
	 * @method getUrl - Prepares API endpoint URL
	 * @method getPreviousPageApiUrl - Prepares API endpoint URL for previous page
	 * @method getNextPageApiUrl - Prepares API endpoint URL for next page
	 * @method getDataValues - Method that returns universal element names
	 *		with parsed values bind to them
	 */

	var services =
		{

			// Facebook API

			facebook: {
				name: 'Facebook',

				defaultFields: 'message,type,created_time,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',

				getUrl: function() {
					return 'https://graph.facebook.com/v2.8/' + config.sourceId + '/posts?fields=' + that.service.defaultFields + '&limit=' + config.postsPerPage + '&access_token=' + config.accessToken;
				},

				getPreviousPageApiUrl: function(receivedData) {
					return receivedData.paging.next ? receivedData.paging.next : false;
				},

				getNextPageApiUrl: function(receivedData) {
					return receivedData.paging.previous ? receivedData.paging.previous : false;
				},

				getDataValues: function(receivedData) {
					var values = [];
					if (receivedData.data) {
						var feedList = receivedData.data;
						for (var i in feedList) {
							values[i] = {
								link	: feedList[i].permalink_url,
								date	: that.formatDate(feedList[i].created_time),
								image	: feedList[i].full_picture,
								text	: feedList[i].message,
								likes	: feedList[i].likes ? feedList[i].likes.summary.total_count : 0,
								comments: feedList[i].comments ? feedList[i].comments.summary.total_count : 0
							};
						}
					}
					return values;
				},
			},


			// YouTube API

			youtube: {
				name: 'YouTube',

				defaultFields: 'snippet',

				getUrl: function() {
					return 'https://www.googleapis.com/youtube/v3/search?channelId=' + config.sourceId + '&order=date&part=' + that.service.defaultFields + '&maxResults=' + config.postsPerPage + '&key=' + config.accessToken;
				},

				getPreviousPageApiUrl: function(receivedData) {
					if (receivedData.nextPageToken) {
						return that.service.getUrl(config) + '&pageToken=' + receivedData.nextPageToken;
					}
					else return false;
				},

				getNextPageApiUrl: function(receivedData) {
					if (receivedData.prevPageToken) {
						return that.service.getUrl(config) + '&pageToken=' + receivedData.prevPageToken;
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
	 * HELPER : Set value to entry element
	 * @param {jQuery} $elem
	 * @param {string} value
	 */

	var setEntryElementValue = function($elem, value) {
		switch ($elem.prop('nodeName')) {
			case 'A':
				value ? $elem.attr('href', value).show() : $elem.attr('href', '').hide();
				break;

			case 'IMG':
				value ? $elem.attr('src', value).show() : $elem.attr('src', '').hide();
				break;

			default: $elem.html(value);
		}
	};


	/** ----------------------------------------------------------------------------
	 * PREPARE FEED ENTRY ELEMENTS
	 * Get DOM entry element and search child elements specified by data selector
	 * @param {object} dataValues
	 * @returns {array}
	 */

	var prepareEntries = function(dataValues) {
		var entriesList = [];

		// Prepare entries and insert them into entries wrapper
		for (var index in dataValues) {
			for (var type in entryElements) {
				setEntryElementValue(entryElements[type], dataValues[index][type]);
			}
			entriesList.push($entry.clone());
		}
		return entriesList;
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Get Feed Entries
	 * @param {string} apiUrl - API endpoint URL
	 */

	var loadEntries = function(apiUrl) {
		$wrapper
			.addClass(config.classNames.loading)
			.removeClass(config.classNames.error + ' ' + config.classNames.empty);

		$.ajax({
			url: apiUrl,

			// Success
			success: function(data, textStatus, jqXHR) {
				if (config.debug) console.log('socialFeed: Data received succesully from: ' + apiUrl);

				var dataValues = that.service.getDataValues.call(that, jqXHR.responseJSON);

				if (dataValues.length < 1) {
					if (config.debug) console.warn('socialFeed [' + that.service.name + ']: Could not process received data. Data is empty or broken.');
					$wrapper
						.removeClass(config.classNames.loading + ' ' + config.classNames.hasPrevious)
						.addClass(config.classNames.empty);

					that.pageNum--;

					$wrapper.trigger('plon.socialfeed.error', {type: 'emptyData'});
					return;
				}

				$wrapper
					.removeClass(config.classNames.loading + ' ' + config.classNames.empty)
					.addClass(config.classNames.loaded)
					.trigger('plon.socialfeed.done');

				$entriesWrapper
					.empty()
					.append(prepareEntries(dataValues));

				previousPageApiUrl = that.service.getPreviousPageApiUrl.call(that, jqXHR.responseJSON);
				nextPageApiUrl = that.service.getNextPageApiUrl.call(that, jqXHR.responseJSON);

				// Check if there is previous page of feed
				if (previousPageApiUrl) $wrapper.addClass(config.classNames.hasPrevious);
				else $wrapper.removeClass(config.classNames.hasPrevious);

				// Check if there is next page of feed
				if (nextPageApiUrl && that.pageNum > 0) $wrapper.addClass(config.classNames.hasNext);
				else $wrapper.removeClass(config.classNames.hasNext);
			},

			// Error
			error: function(jqXHR, textStatus, errorThrown) {
				$wrapper
					.removeClass(config.classNames.loading)
					.addClass(config.classNames.error);

				if (config.debug) {
					console.warn('socialFeed: Request to ' + apiUrl + ' ended with error: ' + errorThrown);
					if (jqXHR.responseJSON) console.log(jqXHR.responseJSON);
				}
			}
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Handle Nav Button
	 * @return {string} type (previous / next)
	 */

	var handleNavButton = function(btnType) {

		var btnTypes = {
			previous: {
				func: that.previousPage,
				selector: config.btnPrevious
			},
			next: {
				func: that.nextPage,
				selector: config.btnNext
			}
		};

		$navigation[btnType] = $wrapper.find(btnTypes[btnType].selector);

		if (!$navigation[btnType].length) {
			if (config.debug) console.warn('socialFeed: Button "' + btnType + '" ("' + btnTypes[btnType].selector + '") was set but not found in document');
			delete $navigation[btnType];
			return false;
		}

		$navigation[btnType].on('click.plon.socialfeed', function(event) {
			event.preventDefault();
			btnTypes[btnType].func();

			// Scroll to wrapper's top
			$('html, body').animate({
				scrollTop: $wrapper.offset().top
			}, 1000);
		});
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Previous Page
	 * @return {string} previous page URL
	 */

	this.previousPage = function() {
		if (config.debug) console.info('socialFeed: Button previous clicked');
		that.pageNum++;
		loadEntries(previousPageApiUrl);
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Next Page
	 * @return {string} next page URL
	 */

	this.nextPage = function() {
		if (config.debug) console.info('socialFeed: Button next clicked');
		if (that.pageNum > 0) {
			that.pageNum--;
			loadEntries(nextPageApiUrl);
		}
	};


	/** ----------------------------------------------------------------------------
	 * METHOD : Init
	 */

	this.init = function() {

		// Setup configuration
		config = $.extend({}, defaults, options);

		if (typeof config.service === 'object') {
			that.service = config.service;
		}
		else if (services[config.service]) {
			that.service = services[config.service];
		}
		else {
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
		$entry.detach();

		// Prepare entryElements array
		$entry.find('[' + config.entryElementsSelector + ']').each(function() {
			entryElements[$(this).attr(config.entryElementsSelector)] = $(this);
		});

		baseApiUrl = that.service.getUrl.call(that);
		loadEntries(baseApiUrl);

		// Handle navigation buttons
		if (config.btnPrevious) handleNavButton('previous');
		if (config.btnNext) handleNavButton('next');

		return true;
	};


	/** ----------------------------------------------------------------------------
	 * INITIATE COMPONENT
	 */

	if (this.init() && config.debug) console.info('[PLON] SocialFeed initiated');
};