/**
 * A method for identifying things
 * */
type Id = string | symbol;

/**
 * Hints identifying things
 * */
type Hint = (Id | Id[]);

namespace Context
{
	export interface Variants
	{
		default: any;
		[variantName: string]: any;
	}

	export interface Styles
	{
		[styleName: string]: {
			colors: Variants;
			contentColors: Variants;
			contrastingStyles: Id[];
		};
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
}

/**
 * Create a root style for your application.
 * Each style has colors associated with it, and contrasting styles and style variations can be obtained. 
 * @param stylesContext Define available styles and variations that can be used when creating the root style, contrasting styles and style variations.
 * @param rootStyleHint Specify of hint of which starting style should be returned.
 */
function rootStyle(stylesContext: Context.Styles, rootStyleHint: Hint): Style
{
	return new InternalStyle();
}

class InternalStyle extends Style
{
	color(): any {}
	contentColor(variantHint?: Hint): any {}
	contrast(styleHint?: Hint): Style
	{
		return new InternalStyle();
	}
	variant(variantHint?: Hint): Style
	{
		return new InternalStyle();
	}
}

export {
	rootStyle,
	Style,
	Id,
	Hint,
	Context
};
