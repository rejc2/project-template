import { dmmf } from '@prisma/client/extension';
import redisMock from 'ioredis-mock';
import createPrismaMock from 'prisma-mock/client';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { app } from '@/app.ts';
import { Prisma, type PrismaClient } from '@/prisma/generated/client/client';

let db: PrismaClient;
let redis: InstanceType<typeof redisMock>;

vi.mock('@/prisma/db', () => ({ getPrisma: () => db }));
vi.mock('@/redis', () => ({ getRedis: () => redis }));

describe('healthRouter', () => {
	beforeEach(() => {
		db = createPrismaMock(Prisma, {
			datamodel: dmmf,
			mockClient: mockDeep(),
		});
		redis = new redisMock();
	});

	it('GET /health returns ok status', async () => {
		const res = await request(app).get('/health');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: 'ok' });
	});
});
