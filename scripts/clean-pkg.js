// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const packageFileData = { ...require("../dist/package.json") };

// Delete prepare script
delete packageFileData.scripts.prepare;

// Write file again
fs.writeFileSync(
  path.join(__dirname, "../dist/package.json"),
  JSON.stringify(packageFileData)
);
