import type { Linter } from 'eslint';

import { getConfig } from './src/index';

const config: Linter.Config[] = getConfig({
	tsconfigRootDir: import.meta.dirname,
});

export default config;
