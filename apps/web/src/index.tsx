import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

console.info(`Build date: ${__BUILD_DATE__}, commit: ${__COMMIT_HASH__}`);

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
