import { RedisStore } from 'connect-redis';
import { type RequestHandler } from 'express';
import session from 'express-session';

const isProduction = process.env['NODE_ENV'] === 'production';

let _sessionMiddleware: RequestHandler | null = null;

export const sessionMiddleware: RequestHandler = (req, res, next) => {
	const secret = process.env['SESSION_SECRET'];
	if (isProduction && secret == null) {
		throw new Error('No value found for SESSION_SECRET');
	}

	_sessionMiddleware ??= session({
		store: new RedisStore({ client: req.context.redis }),
		secret: secret ?? 'none',
		resave: false,
		saveUninitialized: false,
		name: 'session-id',
		cookie: {
			httpOnly: true,
			secure: isProduction,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		},
	});
	_sessionMiddleware(req, res, next);
};
