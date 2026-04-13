import { Box, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import { useBooks } from '@/api/books-example/books-example-api-hooks';
import LogInWithGoogleButton from '@/components/LogInWithGoogleButton';

export function BooksExamplePage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBooks({ first: 5 });

	const books = data?.pages.flatMap((page) => page.books) ?? [];

	return (
		<Box sx={{ p: 3 }}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Typography variant="h1">Books</Typography>
				<LogInWithGoogleButton />
			</Stack>
			<List>
				{books.map((book) => (
					<ListItem key={book.id}>
						<ListItemText primary={book.title} secondary={book.authors.join(', ')} />
					</ListItem>
				))}
			</List>
			{hasNextPage && (
				<Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
					Load more
				</Button>
			)}
		</Box>
	);
}
