import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';

import { getAuth } from './getAuth';

export const authRouter = Router();

authRouter.use('/', (req, res, _next) => {
	const handler = toNodeHandler(getAuth());

	return handler(req, res);
});
