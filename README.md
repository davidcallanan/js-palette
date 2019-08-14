# JS Themio

**Version**: 1.0.0-dev

A simple JavaScript theme and style management library.

## Installation

Install from the [npm repository](https://www.npmjs.com/):

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
function renderApp(themioLayer, depth=3)
{
  // Use the color for the component you are rendering
  renderBackground(themioLayer.getColor());

  // Use the content color for direct content with no further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(themioLayer.getContentColor());
  renderDescription(themioLayer.getContentColor("weak"));
  
  // Create a child layer when you need a separation
  // Passing in no arguments should choose a style that stands out
  // You may also pass in a prefered style, which may be a variant of the current style
  renderCallToActionButton(themioLayer.createChildLayer());
  renderSecondaryButton(themioLayer.createChildLayer("variant", ["default", "strong"]));
  
  // The power of layers allows the same components to stand out in any context
  if (depth <= 0) return;
  renderApp(themioLayer.createChildLayer(), depth - 1);
}
```

## API

### Types

#### `Layer`

Use [`createLayer`](#createlayer) to create a new layer from scratch.

Methods:

 - [`getColor`](#layergetcolor)
 - [`getContentColor`](#layergetcontentcolor)
 - [`createChildLayer`](#layercreatechildlayer)
 
#### `Styles`

`Styles` is an interface of:

 - . <pre>[styleName: string]: [Style](#style)</pre>

#### `Style`

`Style` is an interface of:

 - . <pre>colorVariants: [ColorVariants](#colorvariants)</pre>
 - `contentColor: any`
 - `nestedStyles: string[]`

#### `ColorVariants`

`ColorVariants` is an interface of:

 - `[variantName: string]: any`

### Functions

#### `createLayer`

Signature: <pre>createLayer(styles: [Styles](#styles), preferredStyle: string|string[]): [Layer](#layer)</pre>

Creates a new layer with a preferred style.

#### `Layer.getColor`

Sigature: `getColor()`

Gets a color suitable for rendering the current layer.

#### `Layer.getContentColor`

Signature: `getContentColor(preferredVariant: string|string[])`

Gets a color suitable for rendering direct content in the current layer.

You may pass in a preferred variant to add variation.

#### `Layer.createChildLayer`

Signature: `createChildLayer(preferredStyle: "variant"|string|string[], preferredVariant: string|string[])`

Creates a new layer in order to create a separation.

By default, this should create a strong separation if `nestableStyles` is configured in this way.

However, you may pass in a preferred style to add variation. The `"variant"` style can be used to create a variant of the current layer style.

You may pass in a preferred variant of the preferred style to add more variation.
