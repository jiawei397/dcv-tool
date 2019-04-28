module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    './test/unit'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },

  collectCoverageFrom: [
    './src/**/*.ts',
    '!**/node_modules/**',
  ],

  transform: {
    '^.+\\.(t|j)s?$': 'ts-jest'
  },

  //覆盖率报告
  coverageReporters: ['text', 'text-summary', 'html']
};
