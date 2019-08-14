# js-themio

**Version**: 1.0.0-dev

A simple JavaScript theme and style management library

## Installation

Install from the npm repository:

 - via [npm](https://docs.npmjs.com/cli/npm) -  `npm i themio`
 - via [yarn](https://yarnpkg.com/) - `yarn add themio`

## Usage

Import this library:

```js
import * as Themio from 'themio';
```

Define some colors:

```js
const WHITE_ON_ANY = {
  "strong"  : "#fff",
  "regular" : "#eee",
  "weak"    : "#ddd",
}

const BLACK_ON_WHITE = {
  "strong"  : "#000",
  "regular" : "#111",
  "weak"    : "#222",
}

const BLACK_ON_BLACK = {
  "strong"  : "#222",
  "regular" : "#111",
  "weak"    : "#000",
}

const PURPLE_ON_ANY = {
  "strong"  : "#550A99",
  "regular" : "#5E0BAA",
  "weak"    : "#6E23B3",
}
```

Define styles:

```js
const generateStyles = (theme) => {
  "primary": {
    colorVariants        : PURPLE_ON_ANY,
    contentColorVariants : WHITE_ON_ANY,
    nestableStyles: ["secondary"],
  },
  "secondary": {
    colorVariants        : theme == "dark" ? BLACK_ON_BLACK : WHITE_ON_ANY,
    contentColorVariants : theme == "dark" ? WHITE_ON_ANY   : BLACK_ON_WHITE,
    nestableStyles: ["primary"],
  }
}
```

Create root layer and start rendering!

```js
const theme = decideOnSomeTheme(["light", "dark"]);
const styles = generateStyles(theme);
const rootThemioLayer = Themio.createLayer(styles, "secondary");
renderApp(rootThemioScope);
```

Dummy render function:

```js
function renderApp(themioScope, depth=3)
{
  // Use the content color for direct content with no further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(themioScope.getContentColor());
  renderDescription(themioScope.getContentColor("weak"));
  
  // Create a child layer when you need a new layer
  // Passing in no arguments should choose a style that stands out
  // You may also pass in a prefered style, which may be a variant of the current style
  renderCallToActionButton(themioScope.createChildLayer());
  renderSecondaryButton(themioScope.createChildLayer("variant", ["default", "strong"]));
  
  // The power of layers allows the same components to stand out in any context
  if (depth <= 0) return;
  renderApp(themioScope.createChildLayer(), depth - 1);
}
```
