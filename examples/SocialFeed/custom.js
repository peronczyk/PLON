/* global SocialFeed */

$(function() {

	'use strict';

	var debug = 1;

	// Facebook posts

	new SocialFeed(
		{
			debug		: debug,
			service		: 'facebook',
			sourceId	: 'peronczyk',
			accessToken	: '1800666566886889|ca3aebed50bb3a122d0e44595ff5b405',
			wrapperElem	: '#facebook-feed',
			entryElem	: '#facebook-feed__entry',
			btnPrevious	: '.c-Feed__previous',
			btnNext		: '.c-Feed__next',
		});


	// YouTube movies

	new SocialFeed(
		{
			debug		: debug,
			service		: 'youtube',
			sourceId	: 'UCL8ZULXASCc1I_oaOT0NaOQ', // YT Channel ID
			accessToken	: 'AIzaSyAVboOKc2owBE-5QzuNAV1I3nbypylT2Nc',
			wrapperElem	: '#youtube-feed',
			entryElem	: '#youtube-feed__entry',
			btnPrevious	: '.c-Feed__previous',
			btnNext		: '.c-Feed__next',
		});

});