// types/express.d.ts
import type { AuthenticatedUser, Context } from '../context';

declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface User extends AuthenticatedUser {}

		interface Request {
			context: Context;
		}
	}
}
