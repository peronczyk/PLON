# MutationObserver

## Installation

```javascript
$('#element').observer(options);
```

## Available options

- `params` - You can pass one of available mutation types or array of mutations. Default: `['childList', 'characterData', 'attributes', 'subtree']`.
- `init` - Function that will be initiated when mutation occurs. Default: `null`.
- `debug` - Debug mode. Default: `false`.