import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import css from "@eslint/css";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  // Next.js and Prettier config
  ...compat.config({
    extends: ["next", "prettier"],
  }),

  // JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // JSX files - separate configuration for React
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
  },

  // CSS files - no React rules here
  {
    files: ["**/*.css"],
    plugins: { css },
    languageOptions: {
      parser: css.parser,
    },
    rules: {
      ...css.configs.recommended.rules,
    },
  },

  // Global rules
  {
    rules: {
      // Add your global rules here
      // "no-unused-vars": "warn",
    },
  },
]);
