import type { RouteObject } from 'react-router-dom';

function ThrowError(): never {
	throw new Error('Test error');
}

export const testRoutes: RouteObject[] = [{ path: '/test-error', element: <ThrowError /> }];
