// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    // CSS-Module & Styles
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Optional: Alias @/... -> src/...
    '^@/(.*)$': '<rootDir>/src/$1',
    // Optional: Asset-Mocks
    '\\.(gif|jpg|jpeg|png|svg|ttf|woff2?)$': '<rootDir>/__mocks__/fileMock.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};

export default config;
