import {
	type GetBookResponse,
	type GetBooksResponse,
} from '@rejc2/projecttemplate-api-specs/books-example';
import createPrismaMock from 'prisma-mock/client';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { app } from '@/app.ts';
import { Prisma, type PrismaClient } from '@/prisma/generated/client/client';
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

async function seedBook(bookId = 'book_1', title = 'Test Book') {
	await db.authorExample.create({
		data: { id: 'author_1', name: 'Fred Bloggs' },
	});
	await db.bookExample.create({
		data: { id: bookId, title, description: 'The story of how one man wrote a test case' },
	});
	await db.bookExampleAuthorLink.create({
		data: { authorId: 'author_1', bookId },
	});
}

describe('GET /api/books-example', () => {
	it('returns an empty array when there are no books', async () => {
		const res = await request(app).get('/api/books-example');
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			books: [],
			endCursor: null,
			hasNextPage: false,
		} satisfies GetBooksResponse);
	});

	it('returns all books', async () => {
		await seedBook();

		const res = await request(app).get('/api/books-example');

		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			books: [
				{
					id: 'book_1',
					title: 'Test Book',
					authors: ['Fred Bloggs'],
				},
			],
			endCursor: expect.anything(),
			hasNextPage: false,
		} satisfies GetBooksResponse);
	});
});

describe('GET /api/books-example/:bookId', () => {
	it('returns the book', async () => {
		await seedBook();

		const res = await request(app).get('/api/books-example/book_1');

		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			book: {
				id: 'book_1',
				title: 'Test Book',
				authors: ['Fred Bloggs'],
				description: 'The story of how one man wrote a test case',
			},
		} satisfies GetBookResponse);
	});

	it('returns 404 when book does not exist', async () => {
		const res = await request(app).get('/api/books-example/nope');

		expect(res.status).toBe(404);
		expect(res.body).toEqual({ error: 'Book not found' });
	});
});
