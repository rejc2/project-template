import { RouteObject } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';

const testRoutes = import.meta.env.DEV ? (await import('./testRoutes')).testRoutes : [];

export const routes: RouteObject[] = [
	{
		errorElement: <RouteErrorBoundary />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			...testRoutes,
			{
				path: '*',
				lazy: async () => {
					throw new Response('Page not found', { status: 404, statusText: 'Not Found' });
				},
			},
		],
	},
];
