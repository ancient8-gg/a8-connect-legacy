module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "@typescript-eslint", "jest"],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-empty-function": "warn"
  },
  ignorePatterns: [".storybook", "**/*.stories.*"],
};
