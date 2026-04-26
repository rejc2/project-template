import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

export default defineConfig({
	catalogs: [
		{
			path: '<rootDir>/src/locales/{locale}/messages',
			include: ['src'],
		},
	],
	compileNamespace: 'ts',
	format: formatter({ origins: true, lineNumbers: false }),
	locales: ['de-DE', 'en-GB'],
	sourceLocale: 'en-GB',
});
