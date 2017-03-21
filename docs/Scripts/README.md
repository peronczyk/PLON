# Scripts installation and debuging

Each PLON script is a jQuery plugin that should be initialised separatly. To run them create js file (e.g.: `custom.js`) in _assets/scripts/_ and provide this code:

```javascript
$(function() {

	'use strict';

	// First plugin
	$(someSelector).firstPluginName(firstOptions);

	// Second plugin
	$(anotherSelector).secondPluginName(secondOptions);

	// And so on...
});
```

This is only an example to show you how it works. Each script has it's own way of installation and options list.

