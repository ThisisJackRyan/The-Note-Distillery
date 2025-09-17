import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the directory name from the imported file URL
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname, // Updated from import.meta.dirname
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
      "react/prop-types": "off", // Add this line to disable the rule
    },
  },
]);
