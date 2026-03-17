import Redis from 'ioredis';

let redis: null | Redis = null;

export function getRedis() {
	if (redis == null) {
		const url = process.env.REDIS_URL;
		if (!url) {
			throw new Error('No REDIS_URL set');
		}

		redis = new Redis(url);
	}

	return redis;
}
