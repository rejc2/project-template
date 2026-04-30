import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const serverPort = 3001;
const webPort = 5174;

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	workers: isCI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: `http://localhost:${webPort}`,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'mobile-chrome',
			use: { ...devices['Pixel 7'] },
		},
	],
	webServer: [
		{
			// BE server:
			command: 'yarn workspace @rejc2/projecttemplate-server start',
			url: `http://localhost:${serverPort}/health`,
			reuseExistingServer: !isCI,
			env: {
				PORT: String(serverPort),
				CORS_ORIGIN: `http://localhost:${webPort}`,
				// SERVE_FRONT_END_PATH: '../web/dist',
			},
		},
		{
			// Web FE:
			command: 'yarn workspace @rejc2/projecttemplate-web dev',
			url: `http://localhost:${webPort}`,
			reuseExistingServer: !isCI,
			env: {
				PORT: String(webPort),
				VITE_API_URL: `http://localhost:${serverPort}`,
				VITE_MOCK_API_HANDLERS: '',
			},
		},
	],
});
