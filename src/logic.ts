import {Palette, PreferredStyles, PreferredVariants, StyleName, ColorVariants, ColorVariantName} from './types';

function determineStyle(palette: Palette, preferredStyles: PreferredStyles): StyleName?
{
	// TODO: add a type guard stating whether `palette` has a property named `<returned>`

	if (!Array.isArray(preferredStyles))
		return palette[preferredStyles] || null;

	for (let styleName of preferredStyles)
		if (palette[styleName])
			return styleName;

	return null;
}

function determineColorVariant(variants: ColorVariants, preferredVariants?: PreferredVariants): ColorVariantName
{
	// TODO: add a type guard stating that `variants` has a property named `<returned>` (this is always true)

	if (!Array.isArray(preferredVariants))
		return variants[preferredVariants] || "default";
	
	for (let variantName of preferredVariants)
		if (variants[variantName])
			return variantName;
	
	return "default";
}

function createSubPalette(palette: Palette, allowedStyleNames: StyleName[]): Palette
{
	let newPalette: Palette = {};

	for (let styleName of allowedStyleNames)
		if (palette[styleName])
			newPalette[styleName] = palette[styleName];

	return newPalette;
}

function createSubColorVariants(variants: ColorVariants, disallowedVariants: ColorVariantName[]): ColorVariants
{
	let newVariants: ColorVariants = {};

	for (let variantName in variants)
		if (variants.hasOwnProperty(variantName))
			newVariants[variantName] = variants[variantName];
	
	for (let variantName of disallowedVariants)
		delete newVariants[variantName];

	return newVariants;
}
