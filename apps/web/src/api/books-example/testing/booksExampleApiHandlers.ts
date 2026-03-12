import { HttpResponse, http } from 'msw';

import {
	type GetBookResponse,
	GetBooksParamsSchema,
	type GetBooksResponse,
} from '../books-example-api-schemas';
import { mockBookData } from './mockBookData';

export const booksExampleApiHandlers = [
	http.get<{ id: string }>('/api/book/:id', ({ params }) => {
		const book = mockBookData.find((b) => b.id === params.id);
		if (!book) {
			return new HttpResponse(null, { status: 404 });
		}
		return HttpResponse.json<GetBookResponse>({ book });
	}),

	http.get('/api/books', ({ request }) => {
		const { searchParams } = new URL(request.url);
		const { first: firstFromParams, after } = GetBooksParamsSchema.parse(
			Object.fromEntries(searchParams),
		);
		const first = Math.min(firstFromParams ?? Infinity, 15);

		const startIndex = after ? mockBookData.findIndex((b) => b.id === after) + 1 : 0;
		const books = mockBookData.slice(startIndex, startIndex + first);
		const endCursor = books[books.length - 1]?.id ?? null;
		const hasNextPage = startIndex + first < mockBookData.length;

		return HttpResponse.json<GetBooksResponse>({ books, endCursor, hasNextPage });
	}),
];
