# js-themio

A simple JavaScript theme and style management library

## Installation

Install from the npm repository via [npm](https://docs.npmjs.com/cli/npm): `npm i themio`

Install from the npm repository via [yarn](https://yarnpkg.com/): `yarn add themio`

## Usage

Import this library:

```js
import * as Themio from 'themio';
```

Define colors using [HSL](http://en.citizendium.org/wiki/HSL_and_HSV) format:

```js
const WHITE = {
  "strong"  : Themio.createColor(0.000, 0.000, 1.000),
  "regular" : Themio.createColor(0.000, 0.000, 0.950),
  "weak"    : Themio.createColor(0.000, 0.000, 0.900),
}

const WHITE_CONTENT = WHITE;

const BLACK = {
  "strong"  : Themio.createColor(0.000, 0.000, 0.100),
  "regular" : Themio.createColor(0.000, 0.000, 0.050),
  "weak"    : Themio.createColor(0.000, 0.000, 0.000),

}

const BLACK_CONTENT = {
  "strong"  : BLACK["weaker"],
  "regular" : BLACK["regular"],
  "weak"    : BLACK["stronger"],
}

const PURPLE = {
  "strong"  : Themio.createColor(0.754, 0.878, 0.405),
  "regular" : Themio.createColor(0.754, 0.878, 0.355),
  "weak"    : Themio.createColor(0.754, 0.878, 0.305),
}
```

Define styles:

```js
const styles = (theme) => {
  "primary": {
    colorVariants: PURPLE,
    contentColorVariants: WHITE,
    nestableStyles: ["secondary"],
  },
  "secondary": {
    colorVariants: theme == "dark" ? BLACK : WHITE
    contentColorVariants: theme == "dark" ? BLACK_CONTENT : WHITE_CONTENT,
    nestableStyles: ["primary"],
  }
}
```

Create root scope and start rendering!

```js
const theme = decideOnSomeTheme(["light", "dark"]);
const rootThemioScope = Themio.createScope(styles(theme), "secondary");
renderApp(rootThemioScope);
```

Dummy render function:

```js
function renderApp(themioScope, depth=3)
{
  renderHeading(themioScope.getContentColor());
  renderDescription(themioScope.getContentColor("weak"));
  renderCallToActionButton(themioScope.createChildScope());
  renderSecondaryButton(themioScope.createChildScope("variant", ["default", "strong"]));
  
  if (depth <= 0) return;
  renderApp(themioScope.createChildScope(), depth - 1);
}
```
