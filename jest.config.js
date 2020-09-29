const path = require("path");
module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "packages/*/src/*.{js,jsx,ts,tsx}",
    "!packages/lub/src/*.{js,jsx,ts,tsx}",
    "!packages/example/src/*.{js,jsx,ts,tsx}",
    "!packages/exa/src/*.{js,jsx,ts,tsx}",
    "!packages/types/src/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov", "json"],
  transformIgnorePatterns: [],
};
