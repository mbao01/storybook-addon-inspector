import eslintJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import storybookPlugin from "eslint-plugin-storybook";
import globals from "globals";
import tsEslint from "typescript-eslint";

const __dirname = import.meta.dirname;

const customTsConfig = {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2020,
    },
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: {
    "react-hooks": reactHooksPlugin,
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
    "react/prop-types": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/prefer-nullish-coalescing": ["warn"],
  },
};

const customJsConfig = [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.amd,
      },
    },
  },
];

const reactConfigs = [
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"],
];

const recommendedTypeScriptConfigs = [
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
].map((config) => ({ ...config, files: customTsConfig.files }));

// global ignores
const globalIgnores = {
  ignores: [".storybook", "dist", "coverage", "storybook-static", "vite*.config.ts"],
};

export default [
  globalIgnores,
  eslintJs.configs.recommended,
  ...reactConfigs,
  reactRefreshPlugin.configs.recommended,
  ...storybookPlugin.configs["flat/recommended"],
  ...recommendedTypeScriptConfigs,
  ...customJsConfig,
  customTsConfig,
];
