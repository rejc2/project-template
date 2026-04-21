import redisMock from 'ioredis-mock';
import createPrismaMock from 'prisma-mock/client';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { app } from '@/app.ts';
import { getBetterAuth } from '@/auth/getBetterAuth';
import { Prisma, type PrismaClient } from '@/prisma/generated/client/client';
import * as dmmf from '@/prisma/generated/dmmf.js';

let db: PrismaClient;
let redis: InstanceType<typeof redisMock>;
let auth: ReturnType<typeof getBetterAuth<never>>;

vi.mock('@/prisma/db', () => ({ getPrisma: () => db }));
vi.mock('@/redis', () => ({ getRedis: () => redis }));
vi.mock('@/auth/getAuth', () => ({ getAuth: () => auth }));

describe('healthRouter', () => {
	beforeEach(() => {
		const fixedInstant = Temporal.Instant.from('2011-12-13T14:15:16.789Z');
		vi.spyOn(Temporal.Now, 'instant').mockReturnValue(fixedInstant);
		vi.spyOn(process, 'uptime').mockReturnValue(12345.6789);

		db = createPrismaMock(Prisma, {
			datamodel: dmmf,
			mockClient: mockDeep(),
		});
		redis = new redisMock();

		auth = getBetterAuth({ getPrisma: () => db, getRedis: () => redis });
	});

	it('GET /health returns ok status', async () => {
		const res = await request(app).get('/health');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			healthy: true,
			messages: [],
			services: {
				auth: 'healthy',
				database: 'healthy',
				redis: 'healthy',
			},
			timestamp: '2011-12-13T14:15:16.789Z',
			uptime: 'PT3H25M45.678S',
		});
	});
});
