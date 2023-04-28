module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ['**/test/**/*.test.ts'],

  // test coverage
  collectCoverage: true,

  // only test these three files
  collectCoverageFrom: [
    'src/server/**/*.ts',
    'src/model/**/*.ts',
    'src/middleware/**/*.ts'
  ],

  coverageDirectory: 'test_coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover']
};