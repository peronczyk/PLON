/*
 *	================================================================================
 *
 *	JQ: SOCIAL FEED
 *	Sorce: https://github.com/peronczyk/Streamline
 *
 *	--------------------------------------------------------------------------------
 *	DESCRIPTION:
 *
 *	This script displays entries from social feed taken from popular social networks
 *
 *	--------------------------------------------------------------------------------
 *	INSTALATION:
 *
 *	$('#feed-wrapper).socialFeed({ options });
 *	Options are described below (plugin default configuration)
 *
 *	--------------------------------------------------------------------------------
 *	TODO
 *
 *	Connecting to Twitter. This API requires OA login :/
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

			// Service type (facebook or youtube)
			'service': null,

			// Node ID of social page
			// eg.: http://facebook.com/sourceid
			'sourceId': null,

			// Access token
			// Generated per persona or per app. Check API documentation.
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
			'loadingClassName'		: 'is-Loading',
			'loadedClassName'		: 'is-Loaded',
			'errorClassName'		: 'is-Error',
			'hasNextClassName'		: 'has-Next',
			'hasPrevClassName'		: 'has-Prev',
			'disabledClassName'		: 'u-Disabled',
		};


	/*	----------------------------------------------------------------------------
	 *	SERVICES CONFIGURATION AND METHODS
	 *
	 *	@url - API endpoint URL
	 *	@defaultFields - String that contains list of variables to be received with
	 *		each of feed posts (eg.: title, photo, date, etc). More info are
	 *		available in API documentation.
	 *	@getDataValues - Method that return universal element names
	 *		with parsed values bind to them
	 */

	var services = {

			// Facebook API

			'facebook': {
				'defaultFields': 'message,created_time,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',
				'dataVariable': 'data',

				'url': function(config) {
					return 'https://graph.facebook.com/v2.8/' + config.sourceId + '/posts?fields=' + this.defaultFields + '&limit=' + config.postsPerPage + '&access_token=' + config.accessToken;
				},

				'urlPrev': function(config, receivedData) {
					return (receivedData.paging.next) ? receivedData.paging.next : false;
				},

				'urlNext': function(config, receivedData) {
					return (receivedData.paging.previous) ? receivedData.paging.previous : false;
				},

				'getDataValues': function(config, receivedData) {
					var values = [];
					if (receivedData.data) {
						var feedList = receivedData.data;
						for (var i in feedList) {
							values[i] = {
								'link'		: feedList[i].permalink_url,
								'date'		: formatDate(feedList[i].created_time),
								'image'		: feedList[i].full_picture,
								'text'		: feedList[i].message,
								'likes'		: (feedList[i].likes) ? feedList[i].likes.summary.total_count : 0,
								'comments'	: (feedList[i].comments) ? feedList[i].comments.summary.total_count : 0
							};
						}
					}
					return values;
				},
			},


			// YouTube API

			'youtube': {
				'defaultFields': 'snippet',

				'url': function(config) {
					return 'https://www.googleapis.com/youtube/v3/search?channelId=' + config.sourceId + '&order=date&part=' + this.defaultFields + '&maxResults=' + config.postsPerPage + '&key=' + config.accessToken;
				},

				'urlPrev': function(config, receivedData) {
					if (receivedData.nextPageToken) {
						return this.url(config) + '&pageToken=' + receivedData.nextPageToken;
					}
					else return false;
				},

				'urlNext': function(config, receivedData) {
					if (receivedData.prevPageToken) {
						return this.url(config) + '&pageToken=' + receivedData.prevPageToken;
					}
					else return false;
				},

				'getDataValues': function(config, receivedData) {
					var values = [];
					if (receivedData.items) {
						var feedList = receivedData.items;
						for (var i in feedList) {
							values[i] = {
								'link'		: 'https://youtu.be/' + feedList[i].id.videoId,
								'image'		: feedList[i].snippet.thumbnails.high.url,
								'text'		: feedList[i].snippet.title,
							};
						}
					}
					return values;
				},
			}
		};


	/*	----------------------------------------------------------------------------
	 *	PREPARE FEED ENTRY ELEMENTS
	 *	Get DOM entry element and search child elements specified by data selector
	 */

	var prepareEntryElements = function($entry, selector) {
		var entryElements = [];
		$entry.find('[' + selector + ']').each(function(i, elem) {
			entryElements[$(this).attr(selector)] = $(this);
		});
		return entryElements;
	}


	/*	----------------------------------------------------------------------------
	 *	DATE FORMATTING HELPER
	 *	Format: YYYY-MM-DD HH:MM
	 */

	var formatDate = function(date) {
		var date = new Date(date);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
	}


	/*	----------------------------------------------------------------------------
	 *	SET VALUE TO ENTRY ELEMENT
	 */

	var setEntryElementValue = function($elem, value) {
		switch($elem.prop('nodeName')) {
			case 'A':
				(value) ? $elem.attr('href', value).show() : $elem.attr('href', '').hide();
				break;

			case 'IMG':
				(value) ? $elem.attr('src', value).show() : $elem.attr('src', '').hide();
				break;

			default:
				$elem.html(value);
		}
	}


	/*	----------------------------------------------------------------------------
	 *	GET FEED ENTRIES
	 */

	var getFeedEntries = function(config, $self, $entriesWrapper, $entry, entryElements, $navigation, url, pageNum) {

		$self.addClass(config.loadingClassName);

		var preparedUrl = (url) ? url : services[config.service].url(config),
			result = $.ajax({'url': preparedUrl});

		result.then(

			// Success
			function(data, textStatus, jqXHR) {
				if (config.debug) {
					console.log('socialFeed: Data received succesully from: ' + preparedUrl);
					console.log(jqXHR.responseJSON);
				}

				var dataValues = services[config.service].getDataValues(config, jqXHR.responseJSON);

				if (dataValues.length < 1) {
					if (config.debug) console.warn('socialFeed [' + config.service + ']: Could not process received data. Data is empty or broken.');
					return;
				}

				$entriesWrapper.empty();

				$self
					.removeClass(config.loadingClassName)
					.addClass(config.loadedClassName);

				// Prepare entries and insert them into entries wrapper
				for (var index in dataValues) {
					for (var type in entryElements) {
						setEntryElementValue(entryElements[type], dataValues[index][type]);
					}
					$entriesWrapper.append($entry.clone());
				};

				var urlPrev = services[config.service].urlPrev(config, jqXHR.responseJSON),
					urlNext = services[config.service].urlNext(config, jqXHR.responseJSON);

				// Check if there are previous page of feed
				if (urlPrev) {
					$self.addClass(config.hasPrevClassName);
					if ($navigation.prev) $navigation.prev.attr('href', urlPrev);
				}
				else {
					$self.removeClass(config.hasPrevClassName);
					if ($navigation.prev) $navigation.prev.attr('href', '#0');
				}

				// Check if there are next page of feed
				if (urlNext && pageNum > 0) {
					$self.addClass(config.hasNextClassName);
					if ($navigation.next) $navigation.next.attr('href', urlNext);
				}
				else {
					$self.removeClass(config.hasNextClassName);
					if ($navigation.next) $navigation.next.attr('href', '#0');
				}

			},

			// Error
			function(jqXHR, textStatus, errorThrown) {
				$self
					.removeClass(config.loadingClassName)
					.addClass(config.errorClassName);

				if (config.debug) {
					console.warn('socialFeed: Request to ' + preparedUrl + ' ended with error: ' + errorThrown);
					if (jqXHR.responseJSON) console.log(jqXHR.responseJSON);
				}
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
			$self = $(this),
			$navigation = {},
			pageNum = 0; // Points to number of loaded feed entries.

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

		getFeedEntries(config, $self, $entriesWrapper, $entry, entryElements, $navigation, null, pageNum);


		// Button: PREVIOUS

		if (config.btnPrevious) {
			$navigation.prev = $self.find(config.btnPrevious);
			if ($navigation.prev.length > 0) {
				$navigation.prev.on('click.socialfeed', function(event) {
					event.preventDefault();
					var href = $(this).attr('href');
					if (href.length > 2) {
						pageNum++;
						getFeedEntries(config, $self, $entriesWrapper, $entry, entryElements, $navigation, href, pageNum);
						if (config.debug) console.info('socialFeed: Button previous clicked');
					}
				});
			}
			else if (config.debug) console.warn('socialFeed: Button previous was set but not found in document');
		}


		// Button: NEXT

		if (config.btnNext) {
			$navigation.next = $self.find(config.btnNext);
			if ($navigation.next.length > 0) {
				$navigation.next.on('click.socialfeed', function(event) {
					event.preventDefault();
					var href = $(this).attr('href');
					if (href.length > 2) {
						if (pageNum > 0) pageNum--;
						getFeedEntries(config, $self, $entriesWrapper, $entry, entryElements, $navigation, href, pageNum);
						if (config.debug) console.info('socialFeed: Button next clicked');
					}
				});
			}
			else if (config.debug) console.warn('socialFeed: Button next was set but not found in document');
		}

		return $self;
	}



})(jQuery);