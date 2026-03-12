import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useBooks } from '@/api/books-example/books-example-api-hooks';

export function HomePage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBooks({ first: 5 });

	const books = data?.pages.flatMap((page) => page.books) ?? [];

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h1">Home</Typography>
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
