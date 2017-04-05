/* global SocialFeed */

$(function() {

	'use strict';

	var debug = 1;

	// Facebook posts

	var fbFeed = new SocialFeed(
		{
			debug		: debug,
			service		: 'facebook',
			sourceId	: 'peronczyk',
			accessToken	: '1800666566886889|ca3aebed50bb3a122d0e44595ff5b405',
			entryElem	: '#facebook-feed__entry',
			btnPrevious	: '.c-Feed__prev',
			btnNext		: '.c-Feed__next',
		});


	// YouTube movies

	var ytFeed = new SocialFeed(
		{
			debug		: 0,
			service		: 'youtube',
			sourceId	: 'UCL8ZULXASCc1I_oaOT0NaOQ',
			accessToken	: 'AIzaSyAVboOKc2owBE-5QzuNAV1I3nbypylT2Nc',
			entryElem	: '#youtube-feed__entry',
			btnPrevious	: '.c-Feed__prev',
			btnNext		: '.c-Feed__next',
		});

});