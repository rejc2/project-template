import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './server';

// Give MSW a base URL so it can resolve relative handler paths in Node
Object.defineProperty(global, 'location', { value: new URL('http://localhost/') });

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
