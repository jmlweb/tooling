import reactConfig from "@jmlweb/eslint-config-react";

export default [
  ...reactConfig,
  {
    ignores: ["dist/", "node_modules/", "coverage/", "*.config.js"],
  },
];
