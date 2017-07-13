# Modal

Simple modal (popup) layer for websites.

## Installation

Setup script in your custom.js this way:
```javascript
$.modal(options);
```
List of options with description is available below (default configuration)

## Available options

* `wrapperElem` - CSS selector for modal wrapper element. Default: `.c-Modal`,
* `windowElem` - CSS selector for child element of wrapper that will position content. This class is used to determine if user clicked inside modal or outside to close it. Default: `.c-Modal__window`,
* `contentElem` - CSS selector for child element of wraper that will contain content of modal (eg.: text, images). Default: `.c-Modal__content`.
* `dataSelector` - Data attribute name for DOM elements that should open modals after clicking on them. Default: `data-modal`.
* `openBodyClassName` - CSS class name added to <body> tag that indicates if modal is open. Use it to hide browser scroll bar and to add styling to modal. Default: `c-Modal__is-Open`.

## ToDo

* Method that opens modal in other scripts eg.: `$('.some-class').openModal({'type': });`
* Auto injecting modal DOM structure to body
* Handling ESC and history back to close modal