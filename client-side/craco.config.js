const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@lib/(.*)$": "<rootDir>/src/lib/$1",
      },
    },
  },
};
