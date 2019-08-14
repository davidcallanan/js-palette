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

Define some colors and variants:

```js
const WHITE = {
  "strong"  : "#fff",
  "regular" : "#eee",
  "weak"    : "#ddd",
}

const BLACK = {
  "strong"  : "#000",
  "regular" : "#111",
  "weak"    : "#222",
}

const PURPLE = {
  "strong"  : "#550A99",
  "regular" : "#5E0BAA",
  "weak"    : "#6E23B3",
}

// You may add additional color variants such as `error`, `warning` and `success`
```

Define some styles (you should have at least two for contrast):

```js
const generateStyles = (theme) => ({
  "primary": {
    colorVariants        : PURPLE,
    contentColorVariants : WHITE,
    nestableStyles: ["secondary"],
  },
  "secondary": {
    colorVariants        : theme == "dark" ? BLACK : WHITE,
    contentColorVariants : theme == "dark" ? WHITE : BLACK,
    nestableStyles: ["primary"],
  }
})
```

Create root layer and start rendering!

```js
const theme = decideOnSomeTheme(["light", "dark"]);
const styles = generateStyles(theme);
const rootThemioLayer = Themio.createLayer(styles, "secondary");
renderApp(rootThemioLayer);
```

Dummy render function:

```js
function renderApp(themioLayer, depth=3)
{
  // Use the color for the element you are rendering
  renderBackground(themioLayer.getColor());

  // Use the content color for direct content that won't have any further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(themioLayer.getContentColor());
  renderDescription(themioLayer.getContentColor("weak"));
  
  // Create a child layer when you need a style separation
  // The arguments allow you to configure whether you want the element to stand out or not
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

Use [`createLayer`](#createlayer) to create a new layer from [styles](#styles).

Methods:

 - [`getColor`](#layergetcolor)
 - [`getContentColor`](#layergetcontentcolor)
 - [`createChildLayer`](#layercreatechildlayer)
 
#### `Styles`

`Styles` is an interface of:

 - . <pre>[styleName: string]: [Style](#style)</pre>

Typically, your application will have at least two styles for constrast: primary and secondary.

#### `Style`

`Style` is an interface of:

 - . <pre>colorVariants: [ColorVariants](#colorvariants)</pre>
 - . <pre>contentColorVariants: [ColorVariants](#colorvariants)</pre>
 - `nestableStyles: string[]`
 
`colorVariants` specifies one or more variants of the color that an element with this style should be.

`contentColorVariants` specifies one or more variants of the content color that an element with this style should have.

`nestableStyles` specifies one or more styles that can be used in a child layer of a layer with this style.

#### `ColorVariants`

`ColorVariants` is an interface of:

 - `[variantName: string]: any`
 
Color variants can be useful when you need to distinguish between elements with the same style. For example, you may alternate between a lighter and darker variant for the background color, or you may use a darker variant for the color of a horizontal separation line.

They also allow you to use different colors in different contexts, for example if there is an error.

Example variants: default, strong, weak, error, warning, success.

TODO: error, warning and success should really be styles rather than variants, as they themselves need variants... Does this mean we need nested styles? (not nestable styles which I might need to rename)

### Functions

#### `createLayer`

Signature: <pre>createLayer(styles: [Styles](#styles), preferredStyle: string|string[]): [Layer](#layer)</pre>

Creates and returns a new layer with a preferred style.

#### `Layer.getColor`

Sigature: `getColor(preferredVariant?: string|string[]): any`

Returns a color suitable for rendering the current layer.

You may pass in a preferred variant to add variation, although this may be overridden if the layer already has a preferred variant.

#### `Layer.getContentColor`

Signature: `getContentColor(preferredVariant?: string|string[]): any`

Returns a color suitable for rendering direct content of the current layer.

You may pass in a preferred variant to add variation.

#### `Layer.createChildLayer`

Signature: <pre>createChildLayer(preferredStyle?: "variant"|string|string[], preferredVariant?: string|string[]): [Layer](#layer)</pre>

Creates and returns a new layer in order to create a style separation.

By default, this will choose the first element of the [`nestableStyles`](#style) field of the layer.

However, you may pass in a preferred style to add variation. The `"variant"` style can be used to create a variant of the current layer style.

You may pass in a preferred variant of the preferred style to add more variation.
