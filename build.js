const fs = require("fs");
const path = require("path");
const StyleDictionary = require("style-dictionary").default;
const { formats } = require("style-dictionary/enums");
const tokensFolderPath = path.join(__dirname, "prepared-tokens");

const {
  androidColors,
  androidDimens,
  androidFontDimens,
  iosMacros,
  cssVariables,
} = formats;

const getSource = (color) => {
  const metadataFilePath = path.join(tokensFolderPath, "$metadata.json");
  const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
  const tokensOrder = metadata.tokenSetOrder.filter((item) => {
    if (item.includes("Colors")) {
      return item.includes(color);
    }
    return item;
  });
  return tokensOrder.map((item) => `prepared-tokens/${item}.json`);
};

const getStyleDictionaryConfig = (color) => {
  return {
    source: getSource(color),
    platforms: {
      web: {
        transformGroup: "web",
        buildPath: `build/css/${color.toLowerCase()}/`,
        files: [
          {
            destination: "variables.css",
            format: cssVariables,
          },
        ],
      },
      android: {
        transformGroup: "android",
        buildPath: `build/android/${color.toLowerCase()}/`,
        files: [
          {
            destination: "tokens.colors.xml",
            format: androidColors,
          },
          {
            destination: "tokens.dimens.xml",
            format: androidDimens,
          },
          {
            destination: "tokens.font_dimens.xml",
            format: androidFontDimens,
          },
        ],
      },
      ios: {
        transformGroup: "ios",
        buildPath: `build/ios/${color.toLowerCase()}/`,
        files: [
          {
            destination: "tokens.h",
            format: iosMacros,
          },
        ],
      },
    },
  };
};

const COLORS = ["Dark", "Light"];
const PLATFORMS = ["web", "ios", "android"];

COLORS.forEach((color) => {
  const config = getStyleDictionaryConfig(color);
  const sd = new StyleDictionary(config);
  PLATFORMS.forEach((platform) => {
    sd.buildPlatform(platform);
  });
});
