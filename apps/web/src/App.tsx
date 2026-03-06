import { CssBaseline, ThemeProvider } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { routes } from './routes';
import { theme } from './theme';

const router = createBrowserRouter(routes);

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
				<RouterProvider router={router} />
			</ErrorBoundary>
		</ThemeProvider>
	);
}
