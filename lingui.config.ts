import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

export default defineConfig({
	catalogs: [
		{
			path: '<rootDir>/packages/locales/locale-data/{locale}/messages',
			include: ['apps/server/src', 'apps/web/src'],
		},
	],
	compileNamespace: 'ts',
	format: formatter({ origins: true, lineNumbers: false }),
	locales: ['de-DE', 'en-GB'],
	sourceLocale: 'en-GB',
});
