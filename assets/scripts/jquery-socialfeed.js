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
		},

		services = {
			'facebook': {
				'url': 'https://graph.facebook.com/v2.8/{sourceID}/posts?fields={fields}&limit={postsPerPage}&access_token={accessToken}',
				'defaultFields': 'message,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',
			},

			'youtube': {
				'url': 'https://www.googleapis.com/youtube/v3/search?channelId={sourceID}&order=date&part={fields}&maxResults={postsPerPage}&key={accessToken}',
				'defaultFields': 'snippet'
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


	/*	----------------------------------------------------------------------------
	 *	SET UP JQUERY PLUGIN
	 */

	$.fn.socialFeed = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			$self = $(this),
			$btnPrevious, $btnNext;

		if (config.debug) console.info('Plugin loaded: socialFeed, selected service: ' + config.service);

		var preparedUrl = prepareUrl(config);

		var result = $.ajax({
			'url'		: preparedUrl,
			'method'	: 'get'
		});

		result
			.success(function(data) {
				console.log(data);
			});

		return $self;
	}



})(jQuery);