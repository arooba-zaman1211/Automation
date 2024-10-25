// t-shirt 3 and hoodie 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("canvas");

// Load fonts from file
Font.fromFileSync(
  "public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf",
  "BubbleGum"
);

class NymPost extends Builder {
  constructor({
    width = 3852, // Width from your provided data
    height = 4398, // Height from your provided data
    nymFontSize = "570px", // Font size for Nym text
    nymLineHeight = "662.91px", // Line height for Nym text
    Nym = "", // The Nym text
    NymColor = "#000000", // Default text color
    formatNym = false, // Whether to format Nym to uppercase
    top = 245, // Top position from your provided data
    left = 223, // Left position from your provided data
    nymWidth = 3505, // Match width for Nym text
    nymHeight = 3989, // Match height for Nym text
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      NymColor,
      nymFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top, // Include top and left in the styles
      left,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  setNymcolor(value) {
    this.options.set("");
  }

  async render() {
    const { Nym, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top,
      left,
    } = this.styles;

    // Define the inner border dimensions and reduce size for padding
    const innerBorderWidth = nymWidth; // You can adjust this as needed
    const innerBorderHeight = nymHeight; // You can adjust this as needed
    const newWidth = innerBorderWidth - 120; // Adjust padding as necessary
    const newHeight = innerBorderHeight - 120; // Adjust padding as necessary

    const nymFontSizeNum = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);
    const lineHeightRatio = nymLineHeightNum / nymFontSizeNum;

    // Dynamically calculate the font size based on container size
    const calculatedNymFontSize = `${Math.min(newWidth, newHeight) * 0.15}px`; // Adjust the multiplier for scaling
    const calculatedNymLineHeight = `${
      parseFloat(calculatedNymFontSize) * lineHeightRatio
    }px`;

    // Create a canvas to measure text dimensions
    const canvas = createCanvas(1, 1); // Create a blank canvas
    const context = canvas.getContext("2d");

    // Set the font to measure the text
    context.font = `${nymFontSize} BubbleGum`; // Adjust the font name as needed
    const measuredTextWidth = context.measureText(Nym.toUpperCase()).width;

    // Check if the Nym text fits within the available width and height
    const isNymTextFitting =
      measuredTextWidth < newWidth && nymFontSizeNum < newHeight;

    // Set the final font size based on whether it fits
    const finalNymFontSize = isNymTextFitting
      ? nymFontSize
      : calculatedNymFontSize;
    const finalNymLineHeight = isNymTextFitting
      ? nymLineHeight
      : calculatedNymLineHeight;

    // Format Nym text to uppercase if needed
    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    return JSX.createElement(
      "div",
      {
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
      // Nym Text
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: finalNymFontSize,
            fontFamily: "BubbleGum",
            color: NymColor,
            lineHeight: finalNymLineHeight,
            whiteSpace: "pre-wrap",
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            marginTop: `${top}px`, // From your provided data
            paddingLeft: `0 0 0 ${left}px`, // From your provided data
            textTransform: "uppercase",
            textAlign: "center", // Ensure text is centered within the bounding box
            alignItems: "center",
            justifyContent: "center",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPost };
