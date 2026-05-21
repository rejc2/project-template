import { describe, expect, it } from 'vitest';

import { getBook, getBooks } from './books-example-api';

describe('books-example-api', () => {
	describe('getBooks', () => {
		it('returns list of books', async () => {
			const response = await getBooks({ first: 4 });
			expect(response.books).toEqual(
				expect.arrayContaining([
					{
						id: '1',
						title: 'Round Ireland with a Fridge',
						authors: ['Tony Hawks'],
					},
				]),
			);
			expect(response.books.length).toEqual(4);
			expect(response.hasNextPage).toEqual(true);
		});
	});

	describe('getBook', () => {
		it('returns a book', async () => {
			const response = await getBook('1');
			expect(response).toEqual({
				book: {
					id: '1',
					title: 'Round Ireland with a Fridge',
					authors: ['Tony Hawks'],
					description: expect.stringMatching(/^.{4,}$/),
				},
			});
		});
	});
});
