import createPrismaMock from 'prisma-mock/client';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { app } from '@/app.ts';
import * as dmmf from '@/prisma/generated/dmmf.js';

let db: PrismaClient;

// Use a getter so each test gets the instance created in beforeEach
vi.mock('@/prisma/db.ts', () => ({
	getPrisma() {
		return db;
	},
}));

vi.mock('@/redis.ts', () => ({
	getRedis: () => ({ status: 'ready' }),
}));

beforeEach(() => {
	db = createPrismaMock(Prisma, {
		datamodel: dmmf,
		mockClient: mockDeep(),
	});
});

async function seedBook(id = 'book_1', name = 'Test Book') {
	return db.bookExample.create({
		data: { id, name },
	});
}

describe('GET /books-example', () => {
	it('returns an empty array when there are no books', async () => {
		const res = await request(app).get('/books-example');
		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});

	it('returns all books', async () => {
		await seedBook();

		const res = await request(app).get('/books-example');

		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toMatchObject({ id: 'book_1', name: 'Test Book' });
	});
});

describe('GET /books-example/:bookId', () => {
	it('returns the book', async () => {
		await seedBook();

		const res = await request(app).get('/books-example/book_1');

		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({ id: 'book_1', name: 'Test Book' });
	});

	it('returns 404 when book does not exist', async () => {
		const res = await request(app).get('/books-example/nope');

		expect(res.status).toBe(404);
		expect(res.body).toEqual({ error: 'Book not found' });
	});
});
