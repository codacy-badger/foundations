const { jestNodeGlobalConfig } = require('@reapit/ts-scripts')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  ...jestNodeGlobalConfig,
  testPathIgnorePatterns: ['<rootDir>/src/tests/'],
  coveragePathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|src/types|src/tests|src/scripts|src/__stubs__|dist)[/\\\\]',
    '.d.ts',
    'index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 81,
      functions: 88,
      lines: 91,
      statements: 92,
    },
  },
  moduleNameMapper: {
    ...jestNodeGlobalConfig.moduleNameMapper,
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
}
