# Reveal

jQuery plugin that allows you to animate elements on website when you scroll to them. It adds class names specified with data-xxx tag to DOM element when page loads and then removes it when they are visible in browser viewport.

## Installation

To animate element you need to do 3 things:

1. Add `data-reveal="<your-class-name>"` to HTML element, that you want to animate.
2. Setup script this way: `$.reveal(options);` where as 'options' you can pass an object of options to configure how this plugin works. List of available options are below. Each one is optional.
3. Add supporting CSS classes to your CSS files.
    * `.u-noTransition` - disables animation when blocks are hidden after page was loaded. This class name can be changed by passing one of the options.
    * `.your-class-name` - class that hides your element.

## Available options

* `debug` - Debug mode. Default: `0`.
* `selector` - "data-xxx" selector that defines class name to be added to the element, eg.: `data-reveal="js-Reveal--left"`. Default: `data-reveal`.
* `defaultClassName` - Class name added to all elements that will be revealed. Default: `js-Reveal`.
* `noTransitionClassName` - Class name thar turns CSS animations off. Default: `u-noTransition`.
* `diff` -  How many pixels need to be scrolled after element will show. Default: `300`.

## ToDo
* Add multiple classes to one element