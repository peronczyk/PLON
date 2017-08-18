# Tabs

This script allows you to create tabbed navigation by binding links (`<a>Tab name</a>`) in selected _list container_ with _panels container_. _Panels container_ is defined with data selector (default: `data-tabs-panels` but can be changed in configuration). This feature gives you the ability to place the _tabs list_ in totally different place than the _tabs panels_ - they don't need common wrapper to work.

Script always binds clicked tabs list item to panel by their position (number) in containers.

## Example

HTML code:
```html
<ul role="tablist">
  <li role="tab" aria-selected="true" class="is-Active">Tab name 1</li>
  <li role="tab">Tab name 2</li>
</ul>

<div id="my-tabs">
  <div role="tabpanel" aria-hidden="false" class="is-Active">Tab 1 content</div>
  <div role="tabpanel" aria-hidden="true">Tab 2 content</div>
</div>
```

JavaScript code:
```javascript
$('.tabs-list').tabs(options);
```

## Available options
* `debug` - debug mode. Default: `false`,
* `animateHeight`- Decides if script will change *panels container's* height after switching tabs. If you want to animate it you need to set CSS `transition` to *panels container* on your own. Default: `true`.
* `autoActivateFirstTab` - Decides if script will check if any tab is selected, and if not, it will automatically select first one. Default: `true`.
* `dataBinder` - HTML data attribute of tabs *list container* that points its name to ID of *panels container*. Default: `data-tabs-panels`.
* `eventsNamespace` - namespace added to monitored and fired events. Default: `.plon.tabs`.
* `classNames` - object with list of classnames that indicates changes:
  * `active` - indicates both tabs *list link* and tabs *panels panel* when their active (open). Default: `is-Active`.
  * `panel`

## Catchable events

* `change.tabs.plon` - Triggered on tabs list and tabs container each time tabs are changed.