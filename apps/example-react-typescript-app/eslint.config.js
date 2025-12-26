import reactConfig from "@jmlweb/eslint-config-react";

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "coverage/",
      "*.config.js",
      "*.config.ts",
    ],
  },
  ...reactConfig,
];
