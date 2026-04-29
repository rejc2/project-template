import {
	type GetBookResponse,
	type GetBooksParams,
	type GetBooksResponse,
} from '@rejc2/projecttemplate-api-specs/books-example';
import {
	type InfiniteData,
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import { LookupCache, type WithOptional } from '../apiUtils';
import { getBook, getBooks } from './books-example-api';

type PartialGetBookResponse = Omit<GetBookResponse, 'book'> & {
	book: WithOptional<GetBookResponse['book'], 'description'>;
};

const booksLookupCache = new LookupCache(
	(page: GetBooksResponse) => page.books,
	(book) => book.id,
);

export function useBook(bookId: string) {
	const queryClient = useQueryClient();

	return useQuery<PartialGetBookResponse>({
		queryKey: ['book', bookId],
		queryFn: () => getBook(bookId),

		placeholderData: () => {
			// Search all queries that start with 'books'
			const allBookQueries = queryClient.getQueriesData<InfiniteData<GetBooksResponse>>({
				queryKey: ['books', {}],
			});

			for (const [_key, data] of allBookQueries) {
				const found = booksLookupCache.get(data, bookId);

				if (found) return { book: found };
			}
		},
	});
}

export function useBooks(params: Omit<GetBooksParams, 'after'> = {}) {
	const { first, ...otherParams } = params;
	const queryKey = ['books', otherParams];

	return useInfiniteQuery<
		GetBooksResponse,
		Error,
		InfiniteData<GetBooksResponse>,
		typeof queryKey,
		undefined | string
	>({
		queryKey,
		queryFn: ({ pageParam }) => getBooks({ ...otherParams, first, after: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? (lastPage.endCursor ?? undefined) : undefined,
	});
}
