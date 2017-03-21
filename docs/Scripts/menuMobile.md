# MenuMobile

Adds mobile functionality to normal navigation menu by adding or removing specified class names to <body> element and/or toggle and menu element.
Styling is in your hand.

## Installation

`$('#mobile-menu-toggle').mobileMenu(options);`

You can pass an object of options to configure how this plugin works. The following options are accepted, each one is optional:

* `debug` - Debug mode. Default: `0`
* `menuElem` - Class name or ID of DOM element that contains menu. Define this only if you want to change class name of this element when menu state changes. Default: `null`.
* `openClassName` - CSS class added to toggle and menu element. If You don't want to add separate classes to menu and toggle leave it default. Default: `null`.
* `openDataName` - Data atribute name added to menu toggle that indicates whether menu is open or closed. Default: `menumobile-open`.
* `openBodyClassName` - CSS class added to <body> element when menu is open. Set it to 'null' if you want to disable adding class to <body>. You can also use this class to disable browser scroll bar when menu is open. Default: `is-menuMobile--open`.
* `eventsNamespace` - Namespace for events fired with script. Default: `menumobile`.
* `closeByClickingOutside` - Decides if script  should toggle mobile menu, when user clicks outside selected menu element. Default: `true`.
* `closeByClickingBack` - Should script close mobile menu if user uses "backspace" key or triest to go back in browser history (user back arrow in browser). Usefull on mobile devices. Default: `true`.