import { createAuthClient } from 'better-auth/react';

import { env } from '@/env';

export const authClient = createAuthClient({
	// This must match your Express server URL
	baseURL: new URL(`${env.apiUrl}/api/auth`, location.origin).toString(),
});
