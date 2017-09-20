/**
 * =================================================================================
 *
 * PLON Component : ScrollSections
 *
 * @author			Bartosz Perończyk (peronczyk.com)
 * @modified		2017-09-15
 * @repository		https://github.com/peronczyk/plon
 *
 * =================================================================================
 */


(function($) {

	'use strict';

	/*	----------------------------------------------------------------------------
	 *	PLUGIN DEFAULT CONFIGURATION
	 */

	var defaults = {
			debug			: 0,
			activeClassName	: 'is-Active',
			eventsNamespace	: '.plon.scrollsections',
		},
		$document			= $(document),
		$window				= $(window),
		breakPoints			= [],
		activeSectionNum	= null,
		viewportHeight		= $window.height(),
		prevDir				= 0,
		sectionHeight;


	/** ----------------------------------------------------------------------------
	 * SECTION SCROLL
	 */

	function sectionScroll(config, $sections, dir, noscroll) {

		var targetPos = 0,
			targetSectionNum = 1,
			viewportPos = $window.scrollTop();

		// Break if scrolling is performed multiple times at the same direction
		if ($('html, body').is(':animated') && dir === prevDir) return false;

		// Break if page is at top and user want to scroll up
		if (viewportPos == 0 && dir < 0) return false;

		// Decide which section is active now
		$sections.each(function(index) {
			activeSectionNum = index;
			if (viewportPos < breakPoints[index]) return false;
		});

		// Allow normal scrolling (not smooth) if section is higher then viewport
		var $activeSection = $sections.eq(activeSectionNum);

		if (
			($activeSection.height() > viewportHeight) &&
			($activeSection.offset().top + $activeSection.height() > viewportPos + viewportHeight) && // If viewport bottom is not at the bottom of long section
			((Math.round($activeSection.offset().top) != viewportPos) || (dir > 0)) // If viewport is not at start of long section and direction is down
		) return true;

		// Direction : UP
		if (dir < 0) {
			targetSectionNum = activeSectionNum - 1;
			if (viewportPos > breakPoints[targetSectionNum]) targetSectionNum++; // Scroll only to top of section that was little bit scrolled

			// If target section is high one put viewport bottom at section bottom
			if ($sections.eq(targetSectionNum).height() > viewportHeight) {
				if (activeSectionNum == targetSectionNum) return true; // If viewport is at exact bottom of long section allow normal scrolling
				targetPos = breakPoints[targetSectionNum - 1] + ($sections.eq(targetSectionNum).height() - viewportHeight);
			}

			// If target section is first one
			else if (targetSectionNum < 1) {
				targetSectionNum = 0;
				targetPos = 0;
			}

			// Any other situation
			else targetPos = breakPoints[targetSectionNum - 1];
		}

		// Direction : DOWN or neutral
		else {
			targetSectionNum = activeSectionNum + 1;
			targetPos = breakPoints[activeSectionNum];
		}

		// Activate new section
		$sections.removeClass(config.activeClassName);
		$sections.eq(targetSectionNum).addClass(config.activeClassName);

		// Perform smooth scroll
		if (noscroll != 1) {
			$('html, body').stop().animate({scrollTop: targetPos}, {duration: 500, easing: 'swing'});
		}
		prevDir = dir;

		if (config.debug) console.log('DIR: ' + dir + '/' + prevDir + ', viewportPos: ' + viewportPos + ', activeSection: ' + activeSectionNum + ', targetSection: ' + targetSectionNum + ', targetPos: ' + targetPos);

		return false; // Return false to block normal scrolling
	}


	/** ----------------------------------------------------------------------------
	 * GET SECTIONS PARAMS
	 */

	function setSectionsSize(config, $sections) {
		$sections.each(function(index) {
			breakPoints[index] = Math.round($(this).offset().top + $(this).outerHeight());
			if (config.debug) console.log('scrollSections: Vertical breakpoint [' + index + '] set to ' + breakPoints[index]);
		});
	}


	/** ----------------------------------------------------------------------------
	 * SET UP JQUERY PLUGIN
	 */

	$.fn.scrollSections = function(options) {

		var
			// Setup configuration
			config = $.extend({}, defaults, options),

			// Definitions
			$sections = $(this);

		if ($sections.length < 1) {
			if (config.debug) console.error('scrollSections: No elements found');
			return false;
		}

		setSectionsSize(config, $sections);


		// On mouse scroll

		$document.on('DOMMouseScroll' + config.eventsNamespace + ' mousewheel' + config.eventsNamespace, function(event) {
			var dir = 1;
			if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) { dir = -1; }
			return sectionScroll(config, $sections, dir);
		});


		// On keyboard arrows press

		$document.on('keydown' + config.eventsNamespace, function(event) {
			var dir = 0;
			switch (event.which) {
				case 38: dir--; break; // UP
				case 40: dir++; break; // DOWN
			}
			if (dir != 0) return sectionScroll(config, $sections, dir);
		});


		// On window resize

		$window.on('resize' + config.eventsNamespace, function() {
			if ($window.height() != viewportHeight) {
				viewportHeight = $(window).height();
				if (config.debug) console.log('Window height changed to: ' + viewportHeight);
				setSectionsSize(config, $sections);
				sectionScroll(config, $sections, dir);
			}
		});
	}

})(jQuery);