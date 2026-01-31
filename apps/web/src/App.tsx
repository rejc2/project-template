import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './pages/ErrorPage';

const router = createBrowserRouter(routes);

export function App() {
	return (
		<ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
			<RouterProvider router={router} />
		</ErrorBoundary>
	);
}
