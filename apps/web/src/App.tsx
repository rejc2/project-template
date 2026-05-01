import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { messages as messagesDeDe } from '@rejc2/projecttemplate-locales/de-DE/messages.po';
import { messages as messagesEnGb } from '@rejc2/projecttemplate-locales/en-GB/messages.po';
import { messages as messagesZhHantTw } from '@rejc2/projecttemplate-locales/zh-Hant-TW/messages.po';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './pages/ErrorPage';
import { routes } from './routes';
import { theme } from './theme';

i18n.load('en-GB', messagesEnGb);
i18n.load('de-DE', messagesDeDe);
i18n.load('zh-Hant-TW', messagesZhHantTw);
i18n.activate('en-GB');

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

export function App() {
	return (
		<I18nProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ErrorBoundary fallbackRender={({ error }) => <ErrorPage error={error} />}>
						<RouterProvider router={router} />
					</ErrorBoundary>
				</ThemeProvider>
			</QueryClientProvider>
		</I18nProvider>
	);
}
