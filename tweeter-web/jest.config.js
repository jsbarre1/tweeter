module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^tweeter-shared$': '<rootDir>/../tweeter-shared/src/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
      isolatedModules: true,
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(tweeter-shared)/)',
  ],
  testMatch: [
    '**/test/**/*.test.ts',
    '**/test/**/*.test.tsx',
  ],
};
