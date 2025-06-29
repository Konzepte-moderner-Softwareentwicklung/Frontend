export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff2)$': 'jest-transform-stub',
    
    // UI Components
    '^@/components/ui/(.*)$': '<rootDir>/src/__mocks__/ui-components.tsx',
    
    // API Mocks
    '^@/api/offers_api$': '<rootDir>/src/api/__mocks__/offers_api.ts',
    
    // ❌ Diese Zeile RAUSKOMMENTIEREN oder LÖSCHEN:
    // '^react-router-dom$': '<rootDir>/src/__mocks__/react-router-dom.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: {
        jsx: 'react-jsx',
        skipLibCheck: true,
        strict: false
      }
    }]
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
};