# Rich text Editor

Changes simple `<textarea>` into full rich text editor. Allows editing content simmilar way as desktop text processors (eg.: MS Word)


## Installation

```javascript
$('[data-rte]').richTextEditor(options);
```

Changes all `<textarea data-rte></textarea>` in to prepared code. Example styling code can be found in assets/styles/themes/basic/objects/_rte.scss.

You can pass an object of options to configure how this plugin works. The following options are accepted, each one is optional:

* `debug` - Debug mode. Default: `0`.
* `classNames` - You can change class names of major editor elements to fit CSS code style to your needs
* `lang` - Object that contains list of variables that You can translate on your own. By default all texts are in english. This texts are used for editor buttons labels and titles.