// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const generatedScss = fs
  .readFileSync(path.join(__dirname, "../src/generated.scss"))
  .toString();

const mixinName = "tailwind";

const content = `@mixin ${mixinName} {
${generatedScss}
}`;

fs.writeFileSync(path.join(__dirname, "../src/generated.scss"), content);
