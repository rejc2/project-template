import { Box, Button, Typography } from '@mui/material';
import { isRouteErrorResponse } from 'react-router-dom';

interface ErrorPageProps {
	error?: unknown;
}

export function ErrorPage({ error }: ErrorPageProps) {
	let title = 'Something went wrong';
	let message: string | undefined;

	if (isRouteErrorResponse(error)) {
		title = `${error.status} ${error.statusText}`;
		message = typeof error.data === 'string' ? error.data : undefined;
	} else if (error instanceof Error) {
		message = error.message;
	}

	return (
		<Box sx={{ p: 3, textAlign: 'center' }}>
			<Typography variant="h1" gutterBottom>
				{title}
			</Typography>
			{message && (
				<Typography color="text.secondary" gutterBottom>
					{message}
				</Typography>
			)}
			<Button variant="contained" onClick={() => window.location.reload()}>
				Reload page
			</Button>
		</Box>
	);
}
