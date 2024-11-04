const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("canvas");

Font.fromFileSync(
  "public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf",
  "BubbleGum"
);

class NymPosttwo extends Builder {
  constructor({
    width = 3852,
    height = 4398,
    nymFontSize = "570px",
    nymLineHeight = "662.91px",
    Nym = "",
    NymColor = "#000000",
    formatNym = false,
    top = 245,
    left = 223,
    nymWidth = 3505,
    nymHeight = 3989,
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
      top,
      left,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
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

    const nymFontSizeNum = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);
    const lineHeightRatio = nymLineHeightNum / nymFontSizeNum;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    context.font = `${nymFontSize} BubbleGum`;
    const measuredTextHeight = nymFontSizeNum;

    const fitsWithinHeight = measuredTextHeight < nymHeight;

    const finalNymFontSize = fitsWithinHeight
      ? nymFontSize
      : `${nymHeight * 0.9}px`;

    const finalNymLineHeight = fitsWithinHeight
      ? nymLineHeight
      : `${parseFloat(finalNymFontSize) * lineHeightRatio}px`;

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    return JSX.createElement(
      "div",
      {
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        },
      },
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
            marginTop: `${top}px`,
            paddingLeft: `0 0 0 ${left}px`,
            textTransform: "none",
            textAlign: "center",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPosttwo };
