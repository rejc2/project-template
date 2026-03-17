import Redis from 'ioredis';

import { PrismaClient } from '@/prisma/generated/client/client';

export type AuthenticatedUser = {
	userId: string;
};

export interface Context {
	prisma: PrismaClient;
	redis: Redis;
	user?: AuthenticatedUser;
}
