# JS Palette

**Version**: 1.0.0-dev

A simple JavaScript color palette management library.

## Installation

Install from the [npm registry](https://www.npmjs.com/):

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
const rootPaletteLayer = Palette.Layer.create(palette, "secondary");
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

Static methods:

 - [`create`](#layercreate)

Methods:

 - [`getColor`](#layerprototypegetcolor)
 - [`getContentColor`](#layerprototypegetcontentcolor)
 - [`createChildLayer`](#layerprototypecreatechildlayer)
 
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
 - `childrenStyles: string[]`
 
`colorVariants` specifies one or more variants of the color that an element with this style should have.

`contentColorVariants` specifies one or more variants of the content color that an element with this style should have.

`childrenStyles` specifies one or more styles that can be used in a child layer of a layer with this style.

#### `ColorVariants`

`ColorVariants` is an interface of:

 - `[variantName: [ColorVariantName](#colorvariantname)]: any`
 
Color variants can be useful when you need to distinguish between elements with the same style. For example, you may alternate between a lighter and darker variant for the background color, or you may use a darker variant for the color of a horizontal separation line.

They also allow you to use different colors in different contexts, for example if there is an error.

#### `ColorVariantName`

`ColorVariantName` is an alias for `string|symbol`

Each variant name is split into one or more segments separated by semi-colons (`;`). All functions which look for a preferred variant will match segments rather than entire names.

Example variant names: `default`, `strong`, `weak`, `error;default`, `error;strong`, `error;weak`, `warning;default`, `warning;strong`, `warning;weak`, `success;default`, `success;strong` and `success;weak`.

#### `PreferredStyles`

`PreferredStyles` is an alias for `(string|symbol)|(string|symbol)[]?`.

If `null` or `undefined`, acts as an empty array.

If not an array, acts as an array with one element.

#### `PreferredVariants`

`PreferredVariants` is an alias for `(string|symbol)|(string|symbol)[]?`.

If `null` or `undefined`, acts as an empty array.

If not an array, acts as an array with one element.

### Functions

#### `Layer.create`

Signature: <pre>createLayer(palette: [Palette](#palette), preferredStyles: [PreferredStyles](#preferredstyles), preferredVariants?: [PreferredVariants](#preferredvariants)): [Layer](#layer)</pre>

Creates and returns a new layer from a [palette](#palette).

The style is determined from the palette and preferred styles. See [preferred style matching](#preferred-style-matching).

If no style is matched, returns `null`.

The style variant is determined from the `colorVariants` field of the style and the optionally passed preferred variants. See [preferred variant matching](#preferred-variant-matching).

#### `Layer.prototype.getColor`

Sigature: `getColor(): any`

Returns a color suitable for rendering the current layer.

#### `Layer.prototype.getContentColor`

Signature: <pre>getContentColor(preferredVariants?: [PreferredVariants](#preferredvariants)): any</pre>

Returns a color suitable for rendering direct content of the current layer.

The style variant is determined from the `contentColorVariants` field of the current layer's style and the optionally passed preferred variants. See [preferred variant matching](#preferred-variant-matching).

#### `Layer.prototype.createChildLayer`

Signature: <pre>createChildLayer(preferredStyles?: [PreferredStyles](#preferredstyles), preferredVariants?: [PreferredVariants](#preferredvariants)): [Layer](#layer)</pre>

Creates and returns a new layer in order to create a style separation.

The style is determined from the `childrenStyles` field of the current layer's style and the optionally passed preferred styles. See [preferred style matching](#preferred-style-matching).

If no style is matched, the first element of `childrenStyles` of the current layer's style is chosen if exists, else `"variant"` is chosen.

If the style `"variant"` is matched, the current layer's style is reused.

The style variant is determined from the `colorVariants` field of the current layer's style and the optionally passed preferred variants. See [preferred variant matching](#preferred-variant-matching).

### Logic

#### Preferred style matching

Each element in the preferred style array will be considered a preferred style, with priority given from left to right.

The behaviour if no style is matched is defined where the matching occurs.

#### Preferred variant matching

Each element in the preferred variant array will be considered a preferred variant, with priority given from left to right.

Each preferred variant is split into segments separated by semi-colons (`;`) and each segment must be matched for the entire variant to be matched.

Matches for the same variant and style of the parent layer will fail.

If no variant is found, the `default` variant will be chosen if exists (even if this results in the same style and variant of the parent layer), else there will be undefined behaviour.
