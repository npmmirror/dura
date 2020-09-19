module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*.{js,jsx,ts,tsx}", "!**/node_modules/**"],
  coverageReporters: ["text", "lcov", "json"],
  transformIgnorePatterns: [],
};
