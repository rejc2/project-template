import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';

import { useBook } from '@/api/books-example/books-example-api-hooks';
import LogInWithGoogleButton from '@/components/LogInWithGoogleButton';

export function BooksExampleBookPage() {
	const { bookId } = useParams<{ bookId: string }>();
	const { data, isPending, isPlaceholderData, isFetching } = useBook(bookId!);

	const book = data?.book;

	if (book == null) {
		if (isPending) {
			return (
				<Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
					<CircularProgress size={120} />
				</Box>
			);
		} else {
			throw new Response('Book not found', { status: 404, statusText: 'Not Found' });
		}
	}

	return (
		<Box sx={{ p: 3 }}>
			<Stack direction="row" gap={1} justifyContent="space-between">
				<Typography variant="h1">{book.title}</Typography>
				<LogInWithGoogleButton />
			</Stack>
			<Stack gap={1}>
				<Typography variant="subtitle1">{book.authors.join(', ')}</Typography>
				{book.description != null ? (
					<Typography>{book.description}</Typography>
				) : (
					isPlaceholderData && isFetching && <CircularProgress />
				)}
			</Stack>
		</Box>
	);
}
