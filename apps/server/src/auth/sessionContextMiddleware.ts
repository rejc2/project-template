import { fromNodeHeaders } from 'better-auth/node';
import { type RequestHandler } from 'express';

import { type Context } from '@/context';

import { getAuth } from './getAuth';

export const sessionContextMiddleware: RequestHandler = async (req, res, next) => {
	const originalContext = req.context;

	try {
		// Fetch the session using headers
		const sessionData = await getAuth().api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		// Attach if it exists
		if (sessionData) {
			const newContext: Context = {
				...originalContext,
				session: sessionData.session,
				user: sessionData.user,
			};
			req.context = newContext;
		}
	} catch (error) {
		console.error('Auth middleware error:', error);
	}

	next();
};
