// t-shirt 3 and hoodie 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("canvas");

Font.fromFileSync(
  "public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf",
  "BubbleGum"
);

class NymPost extends Builder {
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

    const maxContainerHeight = nymHeight;
    const padding = 120;
    const adjustedHeight = maxContainerHeight - padding;

    let currentFontSize = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);
    const lineHeightRatio = nymLineHeightNum / currentFontSize;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    const calculateWrappedTextHeight = (fontSize, text, maxWidth) => {
      context.font = `${fontSize}px BubbleGum`;
      const words = text.split(" ");
      let line = "";
      let lineCount = 0;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
          line = words[i] + " ";
          lineCount++;
        } else {
          line = testLine;
        }
      }
      lineCount++;

      return lineCount * fontSize * lineHeightRatio;
    };

    while (
      calculateWrappedTextHeight(currentFontSize, Nym, nymWidth) >
        adjustedHeight &&
      currentFontSize > 0
    ) {
      currentFontSize -= 1;
    }

    const finalNymFontSize = `${currentFontSize}px`;
    const finalNymLineHeight = `${currentFontSize * lineHeightRatio}px`;

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
            textTransform: "uppercase",
            textAlign: "center",
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
