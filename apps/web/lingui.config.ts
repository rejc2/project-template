import { defineConfig } from '@lingui/cli';

export default defineConfig({
	sourceLocale: 'en-GB',
	locales: ['de-DE', 'en-GB'],
	catalogs: [
		{
			path: '<rootDir>/src/locales/{locale}/messages',
			include: ['src'],
		},
	],
	compileNamespace: 'ts',
});
