import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/client/client.js';

// Singleton pattern: one client instance for the process lifetime.
// Guards against multiple instances during tsx watch hot-reloads in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
let currentPrismaClient: null | PrismaClient = null;

function createPrismaClient() {
	const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
	return new PrismaClient({
		adapter,
		log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
	});
}

export function getPrisma(): PrismaClient {
	if (process.env['NODE_ENV'] !== 'production') {
		currentPrismaClient ??= globalForPrisma.prisma ?? null;
	}

	if (currentPrismaClient != null) {
		return currentPrismaClient;
	}

	const prisma = createPrismaClient();
	currentPrismaClient = prisma;

	if (process.env['NODE_ENV'] !== 'production') {
		globalForPrisma.prisma = prisma;
	}

	return prisma;
}
