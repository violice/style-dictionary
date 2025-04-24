const fs = require("fs");
const path = require("path");

const tokensFolderPath = path.join(__dirname, "tokens");

try {
  const metadataFilePath = path.join(tokensFolderPath, "$metadata.json");
  const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
  metadata.tokenSetOrder = metadata.tokenSetOrder.filter((item) => {
    return !item.includes("Devices");
  });
  fs.writeFileSync(metadataFilePath, JSON.stringify(metadata));
} catch (e) {
  // silent
}

try {
  const sizesFilePath = path.join(
    tokensFolderPath,
    "01 - Sizes, spaces, radii/Value.json"
  );
  const sizes = JSON.parse(fs.readFileSync(sizesFilePath, "utf8"));
  delete sizes["horizontal margins"];
  fs.writeFileSync(sizesFilePath, JSON.stringify(sizes));
} catch (e) {
  // silent
}

try {
  const devicesFolderPath = path.join(tokensFolderPath, "02 - Devices");
  fs.rmSync(devicesFolderPath, { recursive: true });
} catch (e) {
  // silent
}

try {
  const buildFolderPath = path.join(__dirname, "build");
  fs.rmSync(buildFolderPath, { recursive: true });
}catch (e) {
  // silent
}
