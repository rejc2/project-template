import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './pages/ErrorPage';
import { routes } from './routes';
import { theme } from './theme';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
					<RouterProvider router={router} />
				</ErrorBoundary>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
