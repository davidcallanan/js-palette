type Id = string | symbol;
type Hint = Id | Id[];

namespace Context
{
	/** 
	 * Your application should have at least two styles for constrast, primary and secondary.
	 */

	export interface Styles
	{
		[styleId: string]: {
			colors: Styles.Variants;
			contentColors: Styles.Variants;
			defaultContrastingStyle: Id;
			contrastingStyles: Set<Id>;
		};
	}

	namespace Styles
	{
		export interface Variants
		{
			default: any;
			[variantId: string]: any;
		}
	}
}

abstract class Style
{
	/**
	 * Return the color associated with this style.
	 */
	abstract color(): any;

	/**
	 * Return a content color associated with this style.
	 * @param variantHint Specify a hint of which content color variant to use.
	 */
	abstract contentColor(variantHint?: Hint): any;
	
	/**
	 * Return a new style that contrasts to this style.
	 * @param styleHint Specify a hint of which style should be returned.
	 */
	abstract contrast(styleHint?: Hint): Style;
	
	/**
	 * Return a new style that is a variant of this style.
	 * @param variantHint Specify a hint of which style should be returned.
	 */
	abstract variant(variantHint?: Hint): Style;

	/**
	 * Determine if this style comes from the given style name
	 */
	abstract isStyle(styleName: Id): boolean;

	/**
	 * Determine if this style comes from the given variant name
	 */
	abstract isVariant(variantName: Id): boolean;
}

/**
 * Create a root style for your application.
 * Each style has colors associated with it, and contrasting styles and style variations can be obtained. 
 * @param stylesContext Define available styles and variations that can be used when creating the root style, contrasting styles and style variations.
 * @param rootStyleHint Specify of hint of which starting style should be returned.
 */
function rootStyle(stylesContext: Context.Styles, rootStyleHint: Hint): Style
{
	for (let styleId of rootStyleHint)
		if (stylesContext[styleId])
			return new InternalStyle(stylesContext, styleId);

	throw "[Palette] Could not find style using `rootStyleHint`"
}

class InternalStyle extends Style
{
	private stylesContext: Context.Styles;
	private styleDef;

	constructor(stylesContext: Context.Styles, styleId: string, variantId: string)
	{
		this.stylesContext = stylesContext;
		this.styleId = styleId;
		this.variantId = variantId;
		this.styleDef = this.stylesContext[styleId];
	}

	color(): any
	{
		return this.styleDef.colors[this.variantId];
	}

	contentColor(variantHint?: Hint): any
	{
		for (let variantId of variantHint) {
			let color = this.styleDef.contentColors[variantId];
			if (color) return color;
		}

		return this.styleDef.contentColors.default;
	}
	
	contrast(styleHint?: Hint): Style
	{
		for (let styleId of styleHint || [])
		{
			if (this.stylesContext[styleId] && (
				this.styleDef.contrastingStyles.has(styleId) || this.styleDef.defaultContrastingStyle == styleId
			))
				return new InternalStyle(this.stylesContext, styleId);
		}

		return new InternalStyle(this.stylesContext, this.styleDef.defaultContrastingStyle);
	}
	
	variant(variantHint: Hint): Style
	{
		for (let variantId of variantHint) {
			if(this.styleDef.colors[variantId])
				return new InternalStyle(this.stylesContext, this.styleId, variantId);
		}

		throw "[Palette] Could not find variant using `variantHint`"
	}

	isStyle(styleId: Id): boolean
	{
		return this.styleId == styleId;
	}

	isVariant(variantId: Id): boolean
	{
		return this.variantId == variantId;
	}
}

export {
	rootStyle,
	Style,
	Id,
	Hint,
	Context
};
