//Candle 2, 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("canvas");

Font.fromFileSync(
  "public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf",
  "BubbleGum"
);
Font.fromFileSync("public/assets/fonts/Raleway/Raleway-Regular.ttf", "Raleway");

class NymPostthree extends Builder {
  constructor({
    width = 645,
    height = 546,
    innerBorderWidth = 458,
    innerBorderHeight = 400,
    innerBorderTop = 73,
    innerBorderLeft = 93,
    nymWidth = 359,
    nymHeight = 250,
    nymTop = 148,
    nymLeft = 133,
    nymFontSize = "5vw",
    nymLineHeight = "5.5vw",
    bottomTextWidth = 252,
    bottomTextHeight = 32,
    bottomTextTop = 350,
    bottomTextLeft = 186,
    bottomFontSize = "2vw",
    bottomLineHeight = "2.2vw",
    Nym = "",
    BottomText = "Soy Wax Candle \n 4 oz / 20+ hours",
    NymColor = "#000000",
    formatNym = false,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      BottomText,
      NymColor,
      nymFontSize,
      bottomFontSize,
    });

    this.backgroundImage = null;
    this.backgroundImageLoaded = false;

    this.styles = {
      width,
      height,
      innerBorderWidth,
      innerBorderHeight,
      innerBorderTop,
      innerBorderLeft,
      nymWidth,
      nymHeight,
      nymTop,
      nymLeft,
      nymFontSize,
      nymLineHeight,
      bottomTextWidth,
      bottomTextHeight,
      bottomTextTop,
      bottomTextLeft,
      bottomFontSize,
      bottomLineHeight,
      formatNym,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  setBottomText(value) {
    this.options.set("BottomText", value);
    return this;
  }

  async render() {
    const { Nym, BottomText, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      innerBorderWidth,
      innerBorderHeight,
      innerBorderTop,
      innerBorderLeft,
      nymWidth,
      nymLineHeight,
      nymHeight,
      nymFontSize,
      bottomTextWidth,
      bottomTextHeight,
      bottomTextTop,
      bottomTextLeft,
      bottomLineHeight,
      bottomFontSize,
      formatNym,
    } = this.styles;

    const newWidth = innerBorderWidth - 120;
    const newHeight = innerBorderHeight - 120;

    const nymFontSizeNum = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);

    const lineHeightRatio = nymLineHeightNum / nymFontSizeNum;
    const calculatedNymFontSize = `${Math.min(newWidth, newHeight) * 0.15}px`;
    const calculatedNymLineHeight = `${
      parseFloat(calculatedNymFontSize) * lineHeightRatio
    }px`;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    context.font = `${nymFontSize} BubbleGum`;
    const measuredTextWidth = context.measureText(Nym.toUpperCase()).width;

    const isNymTextFitting =
      measuredTextWidth < newWidth && parseFloat(nymFontSize) < newHeight;

    const finalNymFontSize = isNymTextFitting
      ? nymFontSize
      : calculatedNymFontSize;
    const finalNymLineHeight = isNymTextFitting
      ? nymLineHeight
      : calculatedNymLineHeight;

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid #000",
          display: "flex",
        },
      },
      JSX.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            width: `${innerBorderWidth}px`,
            height: `${innerBorderHeight}px`,
            border: "2px solid #000",
            position: "absolute",
            top: `${innerBorderTop}px`,
            left: `${innerBorderLeft}px`,
            alignItems: "center",
            justifyContent: "center",
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
              textAlign: "center",
              whiteSpace: "pre-wrap",
              width: `${nymWidth}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              textTransform: formatNym ? "uppercase" : "none",
            },
          },
          formattedNym
        )
      ),
      JSX.createElement(
        "p",
        {
          style: {
            position: "absolute",
            fontSize: bottomFontSize,
            fontFamily: "Raleway",
            color: NymColor,
            lineHeight: bottomLineHeight,
            textAlign: "center",
            width: `${bottomTextWidth}px`,
            bottom: "90px",
            left: "50%",
            transform: "translate(-30%, 0)",
            whiteSpace: "pre-wrap",
            margin: 0,
          },
        },
        BottomText
      )
    );
  }
}

module.exports = { NymPostthree };
