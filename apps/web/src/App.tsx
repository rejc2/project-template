import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export function App() {
	return (
		<ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
			<RouterProvider router={router} />
		</ErrorBoundary>
	);
}
