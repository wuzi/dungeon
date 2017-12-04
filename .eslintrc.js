module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  rules: {
    "no-var": 1,
    "brace-style": ["warn", "1tbs"],
    "no-unused-vars": ["error", { args: "after-used" }],
    indent: ["warn", 2, { SwitchCase: 1 }],
    "max-len": ["warn", 100, { ignoreUrls: true, ignoreTemplateLiterals: true }],
    "no-console": "off"
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  overrides: [
    {
      files: ["**/*test.js"],
      env: {
        jest: true
      }
    }
  ]
};
