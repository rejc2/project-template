import { describe, expect, it } from 'vitest';

import { env } from '@/env';

describe('example test', () => {
	it('works', () => {
		expect(1 + 1).toEqual(2);
	});
});

describe('MSW example', () => {
	it('mocks GET /api/book/:id', async () => {
		const response = await fetch(`${env.apiUrl}/api/book/1`);
		const book = await response.json();

		expect(response.ok).toBe(true);
		expect(book).toEqual({
			book: { id: '1', title: 'Round Ireland with a Fridge', authors: ['Tony Hawks'] },
		});
	});
});
