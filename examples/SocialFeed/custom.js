var debug = 1;

$(function() {

	// Facebook posts

	$('#facebook-feed').socialFeed({
		'debug'			: debug,
		'service'		: 'facebook',
		'sourceID'		: 'peronczyk',
		'accessToken'	: '1800666566886889|ca3aebed50bb3a122d0e44595ff5b405',
		'fields'		: 'message,story,full_picture,picture,likes.summary(true).limit(0),comments.summary(true).limit(0),permalink_url,link',
		'entryElem'		: '#facebook-feed__entry',
		'btnPrevious'	: '.c-Feed__prev',
		'btnNext'		: '.c-Feed__next',
	});


	// YouTube movies

	$('#twitter-feed').socialFeed({
		'debug'			: debug,
		'service'		: 'youtube',
		'sourceID'		: 'UCXQ1gyZTgWYkL1PWrX3jiQQ',
		'accessToken'	: 'AIzaSyAVboOKc2owBE-5QzuNAV1I3nbypylT2Nc',
		'fields'		: '',
		'entryElem'		: '#youtube-feed__entry',
		'btnPrevious'	: '.c-Feed__prev',
		'btnNext'		: '.c-Feed__next',
	});

});