module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/packages/src/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
  ],
  transformIgnorePatterns: [],
};
