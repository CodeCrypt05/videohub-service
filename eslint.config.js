import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    ignores: ["node_modules/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      // ✅ THIS IS THE KEY FIX
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Allow console in backend
      "no-console": "off",

      // Warn only (not error)
      "no-unused-vars": "warn",
    },
  },
];
