import RedisMock from 'ioredis-mock';
import createPrismaMock from 'prisma-mock/client';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { Prisma } from '@/prisma/generated/client/client';
import * as dmmf from '@/prisma/generated/dmmf.js';

vi.mock('@/prisma/db.ts', () => ({
	getPrisma() {
		return createPrismaMock(Prisma, {
			datamodel: dmmf,
			mockClient: mockDeep(),
		});
	},
}));

vi.mock('@/redis', () => {
	const redisMock = new RedisMock();
	return {
		getRedis: () => redisMock,
	};
});
