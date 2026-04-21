import { type BetterAuthPlugin, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import type Redis from 'ioredis';

import { getPrisma as defaultGetPrisma } from '@/prisma/db';
import { type PrismaClient } from '@/prisma/generated/client/client';
import { getRedis as defaultGetRedis } from '@/redis';

export function getBetterAuth<TPlugin extends BetterAuthPlugin = never>({
	getPrisma = defaultGetPrisma,
	getRedis = defaultGetRedis,
	plugins = [],
	enableEmailAndPassword = false,
	debugLogToConsole = false,
}: {
	getPrisma?: () => PrismaClient;
	getRedis?: () => null | Redis;
	plugins?: TPlugin[];
	enableEmailAndPassword?: boolean;
	debugLogToConsole?: boolean;
} = {}) {
	const redis = getRedis();

	return betterAuth({
		database: prismaAdapter(getPrisma(), { provider: 'postgresql' }),

		plugins,

		emailAndPassword: {
			enabled: enableEmailAndPassword,
		},

		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			},
		},

		session: {
			storeSessionInDatabase: true,
		},

		secondaryStorage:
			redis != null
				? {
						get: async (key) => {
							return await redis.get(key);
						},
						set: async (key, value, ttl) => {
							if (ttl) {
								await redis.set(key, value, 'EX', ttl);
							} else {
								await redis.set(key, value);
							}
						},
						delete: async (key) => {
							await redis.del(key);
						},
					}
				: undefined,

		logger: debugLogToConsole
			? {
					level: 'debug',
					log: (level, message, meta) => {
						console[level](`[BetterAuth:${level}]`, message, meta ?? '');
					},
				}
			: undefined,
	});
}
