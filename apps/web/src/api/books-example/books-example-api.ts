import type {
	GetBookResponse,
	GetBooksParams,
	GetBooksResponse,
} from './books-example-api-schemas';
import { GetBookResponseSchema, GetBooksResponseSchema } from './books-example-api-schemas';

export async function getBook(id: string): Promise<GetBookResponse> {
	const response = await fetch(`/api/book/${id}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch book: ${response.statusText}`);
	}
	return GetBookResponseSchema.parse(await response.json());
}

export async function getBooks(params?: GetBooksParams): Promise<GetBooksResponse> {
	const searchParams = new URLSearchParams();
	if (params?.first !== undefined) searchParams.set('first', String(params.first));
	if (params?.after !== undefined) searchParams.set('after', params.after);
	const response = await fetch(`/api/books?${searchParams}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch books: ${response.statusText}`);
	}
	return GetBooksResponseSchema.parse(await response.json());
}
