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
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
    {
      displayName: 'Frontend Tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/tests'],
      testMatch: ['**/frontend/**/*.test.tsx'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      collectCoverageFrom: [
        'src/app/components/**/*.{ts,tsx}',
        'src/app/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/frontend/setup.ts'],
    },
  ],
};