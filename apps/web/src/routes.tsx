import type { RouteObject } from 'react-router-dom';

import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { HomePage } from './pages/HomePage';

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
