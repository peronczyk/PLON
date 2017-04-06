# SOCIAL FEED

## DESCRIPTION:

This script displays entries from social feed taken from popular social networks.

## INSTALATION:

```javascript
new SocialFeed(options);
```

## AVAILABLE OPTIONS

- `wrapperElem` (_required_) - CSS selector for entries list wrapper and posts pages naviagation.
- `entryElem` (_required_) - CSS selector for entry DOM structure.
- `service` (_required_) - Service type. Available services: "facebook" and "youtube".
- `sourceId` (_required_) - Service source ID of social page, e.g. http://facebook.com/sourceid
- `accessToken` (_required_) - Access token for selected service. Generated per persona or per app. Check API documentation.
- `fields` - List of variables that describes each post. Check API documentation to view list of available fields.
- `postsPerPage` - How many posts will be received. Default: `4`.
- `entryElementsSelector` - Data attribute name that connects element with text that should be inserted to it. Default: `data-entry-element`.
- `btnPrevious` - CSS selector for previous button. Default: `null`.
- `btnNext` - CSS selector for next button. Default: `null`.
- `classNames` - Predefined list of class names that indicates state of component. These classes is added to `wrapperElem`.
- `debug` - Default: `0`.

## CLASS NAMES

- `loading` - Default: `is-Loading`,
- `loaded` - Default: `is-Loaded`,
- `error` - Default: `is-Error`,
- `hasNext` - Default: `has-Next`,
- `hasPrevious` - Default: `has-Previous`.

## TODO
Connecting to Twitter. This API requires OA login :/