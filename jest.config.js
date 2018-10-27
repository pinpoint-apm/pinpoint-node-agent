module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "jest"
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "json",
    "node",
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
  ],
};