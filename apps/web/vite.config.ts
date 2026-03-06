import { exec } from 'child_process';
import { dirname, resolve } from 'path';
import type { RollupLog } from 'rollup';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { defineConfig } from 'vite';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ command }) => {
	let commitHash: null | string = null;
	if (command === 'build') {
		try {
			const { stdout } = await execAsync('git rev-parse --short HEAD');
			commitHash = stdout.trim();
		} catch {
			commitHash = null;
		}
	}

	return {
		define: {
			__BUILD_DATE__: JSON.stringify(command === 'build' ? new Date().toISOString() : null),
			__COMMIT_HASH__: JSON.stringify(commitHash),
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
			},
		},
		build: {
			rollupOptions: {
				onwarn(warning: RollupLog, warn: (warning: RollupLog) => void) {
					// Suppress "use client" directive warnings from MUI and other libraries
					if (
						warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
						warning.message.includes('"use client"')
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	};
});
