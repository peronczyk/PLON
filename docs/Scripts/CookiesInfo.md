# CookiesInfo

This plugin adds functionality of changing class name of html element depending on the state of specified cookie. It can also change state of mentioned cookie after clicking on specified child element.

## Installation

```javascript
$('#cookies-box').cookiesInfo(options);
```

You can pass an object of options to configure how this plugin works. The following options are accepted, each one is optional:

* `debug` - Debug mode. Default: `0`.
* `visibleClassName` - Name of CSS class name, that makes cookies bar visible. Default: `is-Open`.
* `acceptButton` - DOM selector of element inside cookies info box, that accepts cookie law: Default: `button`,
* `cookieName` - Cookie name stored in visitor's browser. Default: `cookies_accept`.
* `cookieExpiresAfter` - Number of days after which cookies will be expired. Default: `90`.