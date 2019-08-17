// Palette

interface Palette
{
	[styleName: StyleName]: Style;
}

export Palette;

// StyleName

type StyleName = string|symbol;

export StyleName;

// Style

interface Style
{
	colorVariants: ColorVariants;
	contentColorVariants: ColorVariants;
	childrenStyles: StyleName[];
}

export Style;

// ColorVariants

interface ColorVariants
{
	default: any;
	[variantName: ColorVariantName]: any;
}

export ColorVariants;

// ColorVariantName

type ColorVariantName = string|symbol;

export ColorVariantName;

// PreferredStyles

type PreferredStyles = (string|symbol)|(string|symbol)[];

export PreferredStyles;

// PreferredVariants

type PreferredVariants = (string|symbol)|(string|symbol)[];

export PreferredVariants;

// Layer

export Layer from './Layer';
