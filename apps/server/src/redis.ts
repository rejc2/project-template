import Redis from 'ioredis';

let redis: undefined | null | Redis = undefined;

export function getRedis(): null | Redis {
	if (redis === undefined) {
		const url = process.env.REDIS_URL;
		if (!url) {
			console.warn('No REDIS_URL set');
			redis = null;
		} else {
			redis = new Redis(url);
		}
	}

	return redis;
}
