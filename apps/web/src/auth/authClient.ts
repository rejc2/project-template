import { createAuthClient } from 'better-auth/react';

import { env } from '@/env';

export const authClient = createAuthClient({
	// This must match your Express server URL
	baseURL: `${env.apiUrl}/api/auth`,
});
