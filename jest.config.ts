module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // or jsdom for browser-like testing
  // Other Jest configurations...
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.ts",
  },
};
