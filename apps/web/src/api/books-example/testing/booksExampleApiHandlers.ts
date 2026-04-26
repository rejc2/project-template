import {
	type BookItem,
	type GetBookResponse,
	GetBooksParamsSchema,
	type GetBooksResponse,
} from '@rejc2/projecttemplate-api-specs/books-example';
import { HttpResponse, delay, http } from 'msw';

import { env } from '@/env';

import { mockBookData } from './mockBookData';

export const booksExampleApiHandlers = [
	http.get<{ id: string }>(`${env.apiUrl}/api/books-example/:id`, async ({ params }) => {
		await delay();
		const book = mockBookData.find((b) => b.id === params.id);
		if (!book) {
			return new HttpResponse(null, { status: 404 });
		}
		return HttpResponse.json<GetBookResponse>({ book });
	}),

	http.get(`${env.apiUrl}/api/books-example`, async ({ request }) => {
		await delay();
		const { searchParams } = new URL(request.url);
		const { first: firstFromParams, after } = GetBooksParamsSchema.parse(
			Object.fromEntries(searchParams),
		);
		const first = Math.min(firstFromParams ?? Infinity, 15);

		const startIndex = after ? mockBookData.findIndex((b) => b.id === after) + 1 : 0;
		const books = mockBookData.slice(startIndex, startIndex + first).map(
			(book) =>
				({
					id: book.id,
					title: book.title,
					authors: book.authors,
				}) satisfies BookItem,
		);
		const endCursor = books[books.length - 1]?.id ?? null;
		const hasNextPage = startIndex + first < mockBookData.length;

		return HttpResponse.json<GetBooksResponse>({ books, endCursor, hasNextPage });
	}),
];
