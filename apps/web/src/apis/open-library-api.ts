import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';

import {
	type OpenLibrarySearchResponse,
	openLibrarySearchResponseSchema,
} from './open-library-search-api-types';
import {
	type OpenLibraryAuthor,
	type OpenLibraryWork,
	openLibraryAuthorSchema,
	openLibraryWorkSchema,
} from './open-library-works-api-types';

const BASE_URL = 'https://openlibrary.org';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const openLibraryQueryKeys = {
	all: ['openLibrary'] as const,
	searches: () => [...openLibraryQueryKeys.all, 'search'] as const,
	search: (params: SearchParams) => [...openLibraryQueryKeys.searches(), params] as const,
	works: () => [...openLibraryQueryKeys.all, 'work'] as const,
	work: (key: string) => [...openLibraryQueryKeys.works(), key] as const,
	authors: () => [...openLibraryQueryKeys.all, 'author'] as const,
	author: (key: string) => [...openLibraryQueryKeys.authors(), key] as const,
};

// ---------------------------------------------------------------------------
// Params
// ---------------------------------------------------------------------------

export interface SearchParams {
	q: string;
	/** Offset (number of results to skip). Used as the cursor for infinite pagination. */
	offset?: number;
	limit?: number;
	/** Comma-separated list of fields to return, or "*" for all */
	fields?: string;
	sort?: 'new' | 'old' | 'random' | 'key' | 'editions' | 'scans';
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function searchBooks(
	params: SearchParams,
	signal?: AbortSignal,
): Promise<OpenLibrarySearchResponse> {
	const { q, offset = 0, limit = 10, fields, sort } = params;

	const url = new URL(`${BASE_URL}/search.json`);
	url.searchParams.set('q', q);
	url.searchParams.set('offset', String(offset));
	url.searchParams.set('limit', String(limit));
	if (fields) url.searchParams.set('fields', fields);
	if (sort) url.searchParams.set('sort', sort);

	const response = await fetch(url.toString(), { signal });
	if (!response.ok) {
		throw new Error(`Open Library search failed: ${response.status} ${response.statusText}`);
	}

	const json = await response.json();
	return openLibrarySearchResponseSchema.parse(json);
}

// workKey is like "/works/OL45804W"
export async function fetchWork(workKey: string, signal?: AbortSignal): Promise<OpenLibraryWork> {
	const response = await fetch(`${BASE_URL}${workKey}.json`, { signal });
	if (!response.ok) {
		throw new Error(`Open Library work fetch failed: ${response.status} ${response.statusText}`);
	}
	const json = await response.json();
	return openLibraryWorkSchema.parse(json);
}

// authorKey is like "/authors/OL34221A"
export async function fetchAuthor(
	authorKey: string,
	signal?: AbortSignal,
): Promise<OpenLibraryAuthor> {
	const response = await fetch(`${BASE_URL}${authorKey}.json`, { signal });
	if (!response.ok) {
		throw new Error(
			`Open Library author fetch failed: ${response.status} ${response.statusText}`,
		);
	}
	const json = await response.json();
	return openLibraryAuthorSchema.parse(json);
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useSearchBooks(params: Omit<SearchParams, 'offset'>) {
	return useInfiniteQuery({
		queryKey: openLibraryQueryKeys.search(params),
		queryFn: ({ pageParam, signal }) => searchBooks({ ...params, offset: pageParam }, signal),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			const limit = params.limit ?? 10;
			const nextOffset = lastPage.start + limit;
			return nextOffset < lastPage.numFound ? nextOffset : undefined;
		},
		enabled: params.q.trim().length > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes — Open Library results don't change frequently
	});
}

export function useWork(workKey: string) {
	return useQuery({
		queryKey: openLibraryQueryKeys.work(workKey),
		queryFn: ({ signal }) => fetchWork(workKey, signal),
		staleTime: 10 * 60 * 1000,
	});
}

export function useAuthors(authorKeys: string[]) {
	return useQueries({
		queries: authorKeys.map((key) => ({
			queryKey: openLibraryQueryKeys.author(key),
			queryFn: ({ signal }: { signal?: AbortSignal }) => fetchAuthor(key, signal),
			staleTime: 10 * 60 * 1000,
		})),
	});
}
