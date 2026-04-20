import { type RequestHandler, Router } from 'express';

import { getPrisma } from '@/prisma/db';
import { getRedis } from '@/redis';

export const healthRouter = Router();

enum ServiceHealthStatus {
	Unknown = 'unknown',
	Healthy = 'healthy',
	Unhealthy = 'unhealthy',
	Disabled = 'disabled',
}

type HealthStatus = {
	uptime: Temporal.Duration;
	healthy: boolean;
	messages: string[];
	timestamp: Temporal.Instant;
	services: {
		database: ServiceHealthStatus;
		redis: ServiceHealthStatus;
	};
};

export const healthCheckHandler: RequestHandler = async (req, res) => {
	const health: HealthStatus = {
		uptime: Temporal.Duration.from({ milliseconds: Math.floor(process.uptime() * 1_000) }),
		healthy: false,
		messages: [],
		timestamp: Temporal.Now.instant(),
		services: {
			database: ServiceHealthStatus.Unknown,
			redis: ServiceHealthStatus.Unknown,
		},
	};

	const errors = [];
	let haveCriticalError = false;

	try {
		await Promise.all([
			(async () => {
				// 1. Check Prisma (Database)
				try {
					const prisma = getPrisma();
					await prisma.$queryRaw`SELECT 1`;
					health.services.database = ServiceHealthStatus.Healthy;
				} catch (error) {
					errors.push(error);
					health.messages.push('Could not connect to database');
					health.services.database = ServiceHealthStatus.Unhealthy;
					haveCriticalError = true;
				}
			})(),

			(async () => {
				// 2. Check Redis (Secondary Storage)
				try {
					const redis = getRedis();
					if (redis == null) {
						health.services.redis = ServiceHealthStatus.Disabled;
						health.messages.push('Redis is not configured');
					} else {
						const pong = await Promise.race([
							redis.ping(),
							new Promise((_resolve, reject) => setTimeout(() => reject(null), 500)),
						]);
						if (pong === 'PONG') {
							health.services.redis = ServiceHealthStatus.Healthy;
						} else {
							health.services.redis = ServiceHealthStatus.Unhealthy;
							health.messages.push('Could not connect to Redis');
						}
					}
				} catch (error) {
					errors.push(error);
					health.messages.push('Could not connect to Redis');
					health.services.redis = ServiceHealthStatus.Unhealthy;
				}
			})(),
		]);

		health.healthy = !haveCriticalError;

		res.status(haveCriticalError ? 503 : 200).json(health);
	} catch {
		health.messages = ['ERROR'];
		res.status(503).json(health);
	}
};

healthRouter.get('/', healthCheckHandler);
