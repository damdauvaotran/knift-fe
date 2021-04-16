module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  env: {
    es6: true,
    jest: true,
    browser: true,
    node: true,
  },
  rules: {
    "no-use-before-define": "off",
    "prettier/prettier": 1,
    "@typescript-eslint/no-unused-vars": [1],
    "react-hooks/exhaustive-deps": "off",
    quotes: [1, "double", { avoidEscape: false, allowTemplateLiterals: true }],
    "max-len": ["error", { code: 120 }],
  },
};
