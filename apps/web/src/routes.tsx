import type { RouteObject } from 'react-router-dom';

import AppLayoutRoute from './components/AppLayoutRoute';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { HomePage } from './pages/HomePage';
import SearchPage from './pages/SearchPage';

const testRoutes = import.meta.env.DEV ? (await import('./testRoutes')).testRoutes : [];

export const routes: RouteObject[] = [
	{
		errorElement: <RouteErrorBoundary />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				element: <AppLayoutRoute />,
				children: [
					{
						path: '/search',
						element: <SearchPage />,
					},
					{
						path: '/doc/:id',
						lazy: () => import('./pages/DocPage').then((m) => ({ Component: m.default })),
					},
				],
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
