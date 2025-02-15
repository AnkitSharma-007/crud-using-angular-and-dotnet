import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts','<rootDir>/node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',],
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  moduleNameMapper: {
		'src/(.*)': '<rootDir>/src/$1',
	},
};

export default config;
