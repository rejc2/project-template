import { getConfig } from '@rejc2/projecttemplate-eslint-config';
import type { Linter } from 'eslint';

const config: Linter.Config[] = getConfig({
	tsconfigRootDir: import.meta.dirname,
	includeReact: true,
	ignores: ['src/locales'],
});

export default config;
