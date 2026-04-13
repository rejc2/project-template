import { getConfig } from './src/index';

const config = getConfig({
	tsconfigRootDir: import.meta.dirname,
});

export default config;
