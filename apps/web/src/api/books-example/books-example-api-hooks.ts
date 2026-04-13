import type { GetBooksParams } from '@rejc2/projecttemplate-api-specs/books-example';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getBook, getBooks } from './books-example-api';

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
