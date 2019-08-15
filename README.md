# JS Palette

**Version**: 1.0.0-dev

A simple JavaScript color palette management library.

## Installation

Install from the [npm repository](https://www.npmjs.com/):

 - via [npm](https://docs.npmjs.com/cli/npm) -  `npm i palette`
 - via [yarn](https://yarnpkg.com/) - `yarn add palette`

## Usage

Import this library:

```js
import * as Palette from 'palette';
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

// You may add additional color variants, for example for errors or warnings
```

Define some styles (you should have at least two for contrast):

```js
const generatePalette = (theme) => ({
  "primary": {
    colorVariants        : PURPLE,
    contentColorVariants : WHITE,
    childrenStyles: ["secondary"],
  },
  "secondary": {
    colorVariants        : theme == "dark" ? BLACK : WHITE,
    contentColorVariants : theme == "dark" ? WHITE : BLACK,
    childrenStyles: ["primary"],
  }
})
```

Create root layer and start rendering!

```js
const theme = decideOnSomeTheme(["light", "dark"]);
const palette = generatePalette(theme);
const rootPaletteLayer = Palette.createLayer(palette, "secondary");
renderApp(rootPaletteLayer);
```

Dummy render function:

```js
function renderApp(paletteLayer, depth=3)
{
  // Use the color for the element you are rendering
  renderBackground(paletteLayer.getColor());

  // Use the content color for direct content that won't have any further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(paletteLayer.getContentColor());
  renderDescription(paletteLayer.getContentColor("weak"));
  
  // Create a child layer when you need a style separation
  // The arguments allow you to configure whether you want the element to stand out or not
  renderCallToActionButton(paletteLayer.createChildLayer());
  renderSecondaryButton(paletteLayer.createChildLayer("variant", ["default", "strong"]));
  
  // The power of layers allows the same components to stand out in any context
  if (depth <= 0) return;
  renderApp(paletteLayer.createChildLayer(), depth - 1);
}
```

## API

### Types

#### `Layer`

Use [`createLayer`](#createlayer) to create a new layer from a [Palette](#palette).

Methods:

 - [`getColor`](#layergetcolor)
 - [`getContentColor`](#layergetcontentcolor)
 - [`createChildLayer`](#layercreatechildlayer)
 
#### `Palette`

`Palette` is an interface of:

 - <code>[styleName: [StyleName](#stylename)]: [Style](#style)</code>

Typically, your application will have at least two styles for constrast: primary and secondary.

#### `StyleName`

`StyleName` is an alias for `string|symbol`.

#### `Style`

`Style` is an interface of:

 - <code>colorVariants: [ColorVariants](#colorvariants)</code>
 - <code>contentColorVariants: [ColorVariants](#colorvariants)</code>
 - `children: string[]`
 
`colorVariants` specifies one or more variants of the color that an element with this style should have.

`contentColorVariants` specifies one or more variants of the content color that an element with this style should have.

`childrenStyles` specifies one or more styles that can be used in a child layer of a layer with this style.

#### `ColorVariants`

`ColorVariants` is an interface of:

 - `[variantName: [ColorVariantName](#colorvariantname)]: any`
 
Color variants can be useful when you need to distinguish between elements with the same style. For example, you may alternate between a lighter and darker variant for the background color, or you may use a darker variant for the color of a horizontal separation line.

They also allow you to use different colors in different contexts, for example if there is an error.

Example variants: `default`, `strong`, `weak`, `error;default`, `error;strong`, `error;weak`, `warning;default`, `warning;strong`, `warning;weak`, `success;default`, `success;strong` and `success;weak`.

#### `ColorVariantName`

`ColorVariantName` is an alias for `string|symbol`

Each variant name is split into one or more segments separated by semi-colons (`;`). All functions which look for a preferred variant will match segments rather than entire names.

#### `PreferredStyle`

`PreferredStyle` is an alias for `(string|symbol)|(string|symbol)[]`.

If not an array, the preferred style will be considered the value.

If an array, each element in the array will be considered a preferred style, with priority given from left to right.

#### `PreferredVariant`

`PreferredVariant` is an alias for `(string|symbol)|(string|symbol)[]`.

If not an array, the preferred variant will be considered the value.

If an array, each element in the array will be considered a preferred variant, with priority given from left to right.

Each preferred variant is split into segments separated by semi-colons (`;`) and each segment must be matched.

Matches for the same variant and style of the parent layer will fail unless there are no other alternatives. 

If no variant is specified or if no variant is found, the `default` variant will be chosen.

### Functions

#### `createLayer`

Signature: <pre>createLayer(palette: [Palette](#palette), preferredStyle: [PreferredStyle](#preferredstyle), preferredVariant?: [PreferredVariant](#preferredvariant)): [Layer](#layer)</pre>

Creates and returns a new layer with a preferred style.

If a preferred style cannot be found, there will be undefined behaviour.

#### `Layer.getColor`

Sigature: `getColor(preferredVariant?: [PreferredVariant](#preferredvariant)): any`

Returns a color suitable for rendering the current layer.

You may pass in a preferred variant to add variation, although this may be overridden if the layer already has a preferred variant.

#### `Layer.getContentColor`

Signature: <pre>getContentColor(preferredVariant?: [PreferredVariant](#preferredvariant)): any</pre>

Returns a color suitable for rendering direct content of the current layer.

You may pass in a preferred variant to add variation.

#### `Layer.createChildLayer`

Signature: <pre>createChildLayer(preferredStyle?: "variant"|[PreferredStyle](#preferredstyle), preferredVariant?: [PreferredVariant](#preferredvariant)): [Layer](#layer)</pre>

Creates and returns a new layer in order to create a style separation.

You may pass in a preferred style to add variation. The `"variant"` style can be used to use a variat of the current layer style, which shouldn't have as high contrast.

If no preferred style is specified or a preferred style cannot be found, the first style of the available children styles or `"variant"` will be chosen.

You may pass in a preferred variant of the preferred style to add more variation.
