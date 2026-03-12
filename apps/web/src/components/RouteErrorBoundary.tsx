import { useRouteError } from 'react-router-dom';

import { ErrorPage } from '../pages/ErrorPage';

export function RouteErrorBoundary() {
	const error = useRouteError();
	return <ErrorPage error={error} />;
}
