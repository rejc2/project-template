import redisMock from 'ioredis-mock';
import createPrismaMock from 'prisma-mock/client';
import { Temporal } from 'temporal-polyfill';
import { beforeEach, describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { Prisma, type PrismaClient } from '@/prisma/generated/client/client';
import * as dmmf from '@/prisma/generated/dmmf.js';

import { getBetterAuth } from './getBetterAuth';

let db: PrismaClient;
let redis: InstanceType<typeof redisMock>;
let auth: ReturnType<typeof getBetterAuth<never>>;

const email = `ci-test-${Temporal.Now.instant().epochMilliseconds}@example.com`;
const password = 'password123';

describe('auth', () => {
	beforeEach(() => {
		db = createPrismaMock(Prisma, {
			datamodel: dmmf,
			mockClient: mockDeep(),
		});
		redis = new redisMock();

		auth = getBetterAuth({
			getPrisma: () => db,
			getRedis: () => redis,
			enableEmailAndPassword: true,
			debugLogToConsole: true,
		});
	});

	it('better-auth connects to DB correctly', async () => {
		// 1. Sign up (creates user + password hash)
		const signUp = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: 'CI User',
			},
		});

		expect(signUp.user).toBeDefined();
		expect(signUp.user.email).toBe(email);

		const dbUser = await db.user.findFirst({
			where: { email: { equals: email } },
			include: { accounts: true },
		});
		expect(dbUser).not.toBeNull();
		expect(dbUser).toEqual(
			expect.objectContaining({
				email,
				name: 'CI User',
				accounts: [
					expect.objectContaining({
						userId: dbUser?.id,
						password: expect.stringMatching(/^.{10,}$/),
					}),
				],
			}),
		);

		// 2. Sign in (creates session)
		const signIn = await auth.api.signInEmail({
			body: {
				email: email,
				password,
			},
		});

		// 3. Verify DB state directly (truth check)
		const dbSignedInUser = await db.user.findFirst({
			where: { email },
			include: {
				sessions: true,
			},
		});

		expect(dbSignedInUser).not.toBeNull();
		expect(dbSignedInUser?.sessions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					userId: dbUser?.id,
					token: signUp.token,
				}),
				expect.objectContaining({
					userId: dbUser?.id,
					token: signIn.token,
				}),
			]),
		);
	});
});
