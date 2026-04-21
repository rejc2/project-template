import { type Session, type User } from 'better-auth';
import type Redis from 'ioredis';

import type { PrismaClient } from '@/prisma/generated/client/client';

export interface Context {
	prisma: PrismaClient;
	redis?: Redis;
	session?: Session;
	user?: User;
}
