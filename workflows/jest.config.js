/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'API Tests',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests'],
      testMatch: ['**/api/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      collectCoverageFrom: [
        'src/app/api/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup-api.ts'],
    },
    {
      displayName: 'Frontend Tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/tests'],
      testMatch: ['**/components/**/*.test.tsx'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            jsx: 'react-jsx',
          },
        }],
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      collectCoverageFrom: [
        'src/app/components/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup-frontend.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      transformIgnorePatterns: [
        '/node_modules/(?!(@dnd-kit|@dnd-kit/core|@dnd-kit/sortable|@dnd-kit/utilities)/)',
      ],
    },
  ],
};
