import type { RequestHandler } from 'express';

import { getPrisma } from '@/prisma/db';
import { getRedis } from '@/redis';

export const contextMiddleware: RequestHandler = (req, _res, next) => {
	req.context = {
		prisma: getPrisma(),
		redis: getRedis() ?? undefined,
	};

	next();
};
