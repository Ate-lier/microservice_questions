module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ['**/test/**/*.test.ts'],

  // suppress console.log
  //silent: true,
  cache: false,

  // test coverage
  collectCoverage: true,

  // only test these three files
  collectCoverageFrom: [
    'src/app/**/*.ts',
    'src/model/**/*.ts',
    'src/middleware/**/*.ts'
  ],

  coverageDirectory: 'test_coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover']
};