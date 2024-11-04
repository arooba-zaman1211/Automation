// Mug 2, 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("canvas");

Font.fromFileSync(
  "public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf",
  "BubbleGum"
);

class NymPostfive extends Builder {
  constructor({
    width = 2475,
    height = 1155,
    nymFontSize = "160px",
    nymLineHeight = "155px",
    Nym = "HI, I'M NAT",
    NymColor = "#000000",
    formatNym = false,
    top = 470,
    left = 76,
    nymWidth = 920,
    nymHeight = 182,
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
      top,
      left,
      nymWidth,
      nymHeight,
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
      top,
      left,
      nymWidth,
      nymHeight,
    } = this.styles;

    const fixedTextWidth = 960;
    const innerBorderHeight = height - 120;

    const nymFontSizeNum = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);

    const lineHeightRatio = nymLineHeightNum / nymFontSizeNum;
    const calculatedNymFontSize = `${
      Math.min(fixedTextWidth, innerBorderHeight) * 0.15
    }px`;
    const calculatedNymLineHeight = `${
      parseFloat(calculatedNymFontSize) * lineHeightRatio
    }px`;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    context.font = `${nymFontSize} BubbleGum`;
    const measuredTextWidth = context.measureText(Nym.toUpperCase()).width;

    context.font = calculatedNymFontSize;
    const measuredTextHeight =
      parseFloat(calculatedNymFontSize) * lineHeightRatio;

    const isNymTextFitting =
      measuredTextWidth < fixedTextWidth &&
      measuredTextHeight < innerBorderHeight;

    const finalNymFontSize = isNymTextFitting
      ? nymFontSize
      : calculatedNymFontSize;
    const finalNymLineHeight = isNymTextFitting
      ? nymLineHeight
      : calculatedNymLineHeight;

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    const verticalCenterOffset = (nymHeight - measuredTextHeight) / 2;

    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px",
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
            margin: 0,
            textTransform: formatNym ? "uppercase" : "none",
            position: "absolute",
            top: `${top + verticalCenterOffset}px`,
            left: `${left}px`,
            alignItems: "center",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPostfive };
