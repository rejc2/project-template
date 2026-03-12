import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getBook, getBooks } from './books-example-api';
import type { GetBooksParams } from './books-example-api-schemas';

export function useBook(id: string) {
	return useQuery({
		queryKey: ['book', id],
		queryFn: () => getBook(id),
	});
}

export function useBooks(params?: Omit<GetBooksParams, 'after'>) {
	return useInfiniteQuery({
		queryKey: ['books', params],
		queryFn: ({ pageParam }) => getBooks({ ...params, after: pageParam }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? (lastPage.endCursor ?? undefined) : undefined,
	});
}
