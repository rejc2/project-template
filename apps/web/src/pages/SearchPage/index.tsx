import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { openLibraryQueryKeys, useSearchBooks } from '@/apis/open-library-api';

import SearchResultCard from './SearchResultCard';

function trimSearch(searchText: string): string {
	const appendStar = /\S$/.test(searchText);
	let output = searchText.trim().replace(/\s+/, ' ');
	if (output.length < 3) {
		return '';
	}
	if (appendStar) {
		output += '*';
	}
	return output;
}

/** Returns true if results for `a` would be a superset of (or equal to) results for `b`, or vice versa. */
function areSearchesCompatible(a: string, b: string): boolean {
	const strip = (s: string) => (s.endsWith('*') ? s.slice(0, -1) : s);
	const an = strip(a);
	const bn = strip(b);
	return an.startsWith(bn) || bn.startsWith(an);
}

export default function SearchPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchText, setSearchText] = useState(() => searchParams.get('q') ?? '');
	const [debouncedSearch, setDebouncedSearch] = useState(searchText);

	// Sync search text to URL without driving the input from it
	useEffect(() => {
		setSearchParams(searchText ? { q: searchText } : {}, { replace: true });
	}, [searchText, setSearchParams]);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const trimmedSearch = useMemo(() => trimSearch(searchText), [searchText]);

	const queryClient = useQueryClient();
	const isCached = !!queryClient.getQueryData(openLibraryQueryKeys.search({ q: trimmedSearch }));
	const activeSearch = isCached ? trimmedSearch : debouncedSearch;

	// Debounce search input — only needed for uncached queries
	useEffect(() => {
		const id = setTimeout(() => setDebouncedSearch(trimmedSearch), 400);
		return () => clearTimeout(id);
	}, [trimmedSearch]);

	const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useSearchBooks({
		q: activeSearch,
	});

	// Infinite scroll — trigger fetchNextPage when sentinel comes into view
	useEffect(() => {
		const el = loadMoreRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const docs = data?.pages.flatMap((p) => p.docs) ?? [];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<Box
				component="header"
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 1,
					bgcolor: 'background.paper',
					borderBottom: 1,
					borderColor: 'divider',
					p: 2,
				}}
			>
				<TextField
					autoFocus
					fullWidth
					placeholder="Search..."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						},
					}}
				/>
			</Box>

			<Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'action.hover' }}>
				{!areSearchesCompatible(trimmedSearch, activeSearch) ||
				(isFetching && !isFetchingNextPage) ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress />
					</Box>
				) : (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{!isFetching && docs.length === 0 && debouncedSearch.length > 0 && (
							<Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
								No results for &ldquo;{searchText}&rdquo;
							</Typography>
						)}

						{/* <List disablePadding> */}
						{docs.map((doc) => (
							<SearchResultCard key={doc.key} doc={doc} />
						))}
						{/* </List> */}

						{/* Infinite scroll sentinel */}
						<Box ref={loadMoreRef} sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
							{isFetchingNextPage && <CircularProgress size={24} />}
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
}
