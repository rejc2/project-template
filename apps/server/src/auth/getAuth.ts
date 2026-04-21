import { getBetterAuth } from './getBetterAuth';

let auth: null | ReturnType<typeof getBetterAuth>;

export function getAuth() {
	if (auth == null) {
		auth = getBetterAuth();
	}
	return auth;
}
