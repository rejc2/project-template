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
		<div style={{ padding: '20px', textAlign: 'center' }}>
			<h1>{title}</h1>
			{message && <p>{message}</p>}
			<button onClick={() => window.location.reload()}>Reload page</button>
		</div>
	);
}
