import { getConfig } from '@rejc2/projecttemplate-eslint-config';

const config = getConfig({
	tsconfigRootDir: import.meta.dirname,
	includeReact: true,
	ignores: ['src/locales'],
});

export default config;
