module.exports = { rootDir: '.', testRegex: '.*\.spec\.ts$', transform: { '^.+\.(t|j)s$': 'ts-jest' }, testEnvironment: 'node', collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'] };
