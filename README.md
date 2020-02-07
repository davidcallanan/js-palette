# Palette.js

**Version**: 0.1.0

A simple JavaScript color palette management library.

## Dependencies

 - [Node](https://nodejs.org) `^10.16.3` - Note that other versions of node may still be compatible. Other environments may be compatible too.

## Installation

**In the future**, you'll be able to install from the [npm registry](https://www.npmjs.com/):

 - via [npm](https://docs.npmjs.com/cli/npm) -  `npm i palette`
 - via [yarn](https://yarnpkg.com/) - `yarn add palette`

For now, **manually build this package**.

## Usage

Import this library:

```js
import * as palette from 'palette';
```

Define some colors and variants:

```js
const palette = require("palette");

const WHITE_VARIANTS = {
  "strong"  : "#fff",
  "default" : "#eee",
  "weak"    : "#ddd",
}

const BLACK_VARIANTS = {
  "strong"  : "#000",
  "default" : "#111",
  "weak"    : "#222",
}

const PURPLE_VARIANTS = {
  "strong"  : "#550A99",
  "default" : "#5E0BAA",
  "weak"    : "#6E23B3",
}

// You may add additional color variants, for example for errors or warnings
```

Define some styles (you should have at least two for contrast):

```js
const generateStyles = (theme) => ({
  "primary": {
    colors        : PURPLE_VARIANTS,
    contentColors : WHITE_VARIANTS,
    contrastingStyles: new Set(["secondary"]),
    defaultContrastingStyle: "secondary",
  },
  "secondary": {
    colors        : theme == "dark" ? BLACK_VARIANTS : WHITE_VARIANTS,
    contentColors : theme == "dark" ? WHITE_VARIANTS : BLACK_VARIANTS,
    contrastingStyles: new Set(["primary"]),
    defaultContrastingStyle: "primary",
  }
})
```

Create root layer and start rendering!

```js
const theme = decideOnSomeTheme(["light", "dark"]);
const styles = generateStyles(theme);
const style = palette.rootStyle(styles, "secondary");
renderApp(style);
```

Dummy render function:

```js
function renderApp(style, depth=3)
{
  // Use the color for the element you are rendering
  renderBackground(style.color());

  // Use the content color for direct content that won't have any further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(style.contentColor());
  renderDescription(style.contentColor("weak"));
  
  // Create a child layer when you need a style separation
  // The arguments allow you to configure whether you want the element to stand out or not
  renderCallToActionButton(style.contrast().color());
  renderSecondaryButton(style.variant(["default", "strong"]).color());
  
  // The power of layers allows the same components to stand out in any context
  if (depth <= 0) return;
  renderApp(style.contrast(), depth - 1);
}
```

## Documentation

For now, generate the documentation manually by cloning this repo and following the steps in `DEVELOPMENT.md`.

## Development

See `DEVELOPMENT.md` file.

## License

See `LICENSE` file.
