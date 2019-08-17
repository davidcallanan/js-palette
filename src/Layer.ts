import {Palette, PreferredStyles, PreferredVariants} from './types';
import {determineStyle, determineColorVariant, createSubPalette, createSubColorVariants} from './logic';

class Layer
{
	private palette: Palette;
	private styleName: StyleName;
	private style: Style;
	private colorVariantName: ColorVariantName;
	private color: any;

	private constructor() {}

	public static create(palette: Palette, preferredStyles: PreferredStyles, preferredVariants?: PreferredVariants): Layer
	{
		let layer = new Layer();
		layer.palette = palette;
		
		let styleName = determineStyle(layer.palette, preferredStyles);
		if (!styleName) return null;
		layer.styleName = styleName;
		layer.style = layer.palette[styleName];

		let variantName = determineColorVariant(layer.style.colorVariants, preferredVariants);
		layer.colorVariantName = variantName;
		layer.color = layer.style.colorVariants[variantName];
	}

	public getColor(): any
	{
		return this.color;
	}

	public getContentColor(preferredVariants?: PreferredVariants): any
	{
		let variantName = determineColorVariant(layer.style.contentColorVariants, preferredVariants);
		return this.style.contentColorVariants[variantName] || this.style.contentColorVariants.default;
	}

	public createChildLayer(preferredStyles: PreferredStyles, preferredVariants?: PreferredVariants): Layer
	{
		let layer = new Layer();
		layer.palette = this.palette;

		let childrenStyles = [...this.style.childrenStyles, "variant"];
		let subPalette = createSubPalette(this.palette, childrenStyles);
		let styleName = determineStyle(subPalette, preferredStyles) || childrenStyles[0];

		if (subPalette[styleName] && styleName != "variant")
		{
			layer.styleName = styleName;
			layer.style = subPalette[styleName];
		}
		else
		{
			layer.styleName = this.styleName;
			layer.style = this.style;
		}

		let disallowedVariants = layer.styleName == this.styleName ? [this.colorVariantName] : []
		let subVariants = createSubColorVariants(this.style.colorVariants, disallowedVariants);
		let variantName = determineColorVariant(subVariants, preferredVariants) || "default";
		layer.colorVariantName = variantName;
		layer.color = layer.style.colorVariants[variantName];
	}
}

export default Layer;
