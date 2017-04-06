# MUTATION OBSERVER

## DESCRIPTION:

Watches for changes in specified dom element

## INSTALATION:

```javascript
$('div#content').observe(options);
```

## AVAILABLE OPTIONS

- `params` - You can pass one of available mutation types or array of mutations. Default: `['childList', 'characterData', 'attributes', 'subtree']`.
- `init` - Function that will be initiated when mutation occurs. Default: `null`.
- `debug` - Debug mode. Default: `false`.

