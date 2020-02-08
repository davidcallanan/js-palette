// Temporary, until I add proper tests

const palette = require(".");

const WHITE_VARIANTS = {
  "strong"  : "#fff",
  "default" : "#eee",
  "weak"    : "#ddd",
}

const BLACK_VARIANTS = {
  "strong"  : "#000",
  "default" : "#111",
  "weak"    : "#222",
}

const PURPLE_VARIANTS = {
  "strong"  : "#550A99",
  "default" : "#5E0BAA",
  "weak"    : "#6E23B3",
}

const generateStyles = (theme) => ({
  "primary": {
    colors        : PURPLE_VARIANTS,
    contentColors : WHITE_VARIANTS,
    contrastingStyles: new Set(["secondary"]),
    defaultContrastingStyle: "secondary",
  },
  "secondary": {
    colors        : theme == "dark" ? BLACK_VARIANTS : WHITE_VARIANTS,
    contentColors : theme == "dark" ? WHITE_VARIANTS : BLACK_VARIANTS,
    contrastingStyles: new Set(["primary"]),
    defaultContrastingStyle: "primary",
  }
})

const theme = ["light", "dark"][0];
const styles = generateStyles(theme);
const style = palette.rootStyle(styles, "secondary");
renderApp(style);

function renderApp(style, depth=3)
{
	console.log(`\nRendering App (depth=${3-depth})`);

  // Use the color for the element you are rendering
  renderBackground(style.color());

  // Use the content color for direct content that won't have any further layers
  // You may pass in a variant to mix things up a bit
  renderHeading(style.contentColor());
  renderDescription(style.contentColor("weak"));
  
  // Create a child layer when you need a style separation
  // The arguments allow you to configure whether you want the element to stand out or not
  renderCallToActionButton(style.contrast().color());
  renderSecondaryButton(style.variant(["default", "strong"]).color());
  
  // The power of layers allows the same components to stand out in any context
  if (depth <= 0) return;
  renderApp(style.contrast(), depth - 1);
}

function renderBackground(color)
{
	console.log(`Background: ${color}`);
}

function renderHeading(color)
{
	console.log(`Heading: ${color}`);
}

function renderDescription(color)
{
	console.log(`Description: ${color}`);
}

function renderCallToActionButton(color)
{
	console.log(`Strong Button: ${color}`);
}

function renderSecondaryButton(color)
{
	console.log(`Weak Button: ${color}`);
}
