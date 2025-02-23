export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleFileExtensions = ['js', 'json', 'ts'];
export const rootDir = './';
export const testRegex = '.*\\.spec\\.ts$';
export const transform = {
  '^.+\\.ts$': 'ts-jest',
};
export const collectCoverage = true;
export const coverageDirectory = './coverage';
export const testPathIgnorePatterns = ['/node_modules/'];
export const moduleNameMapper = {
  '^apps/(.*)$': '<rootDir>/apps/$1',
};
export const roots = [
  // '<rootDir>/apps/gateway/test',
  // '<rootDir>/apps/notifications/test',
  '<rootDir>/apps/users/src/test',
];
