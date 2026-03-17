import { defineConfig } from 'prisma/config';

try {
	process.loadEnvFile('.env');
} catch {
	// .env may not exist in all environments (e.g. when DATABASE_URL is set directly)
}

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
	schema: './prisma/schema',
	migrations: {
		seed: 'tsx prisma/seed.ts',
	},
	datasource:
		databaseUrl != null
			? {
					url: databaseUrl,
					shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
				}
			: undefined,
});
