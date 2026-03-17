import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { app } from './app.ts';

vi.mock('./db.ts', () => ({ prisma: {} }));

describe('server', () => {
	it('GET / returns welcome message', async () => {
		const res = await request(app).get('/');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ message: 'project-template server is running' });
	});

	it('GET /health returns ok status', async () => {
		const res = await request(app).get('/health');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: 'ok' });
	});

	it('GET /version returns build info', async () => {
		const res = await request(app).get('/version');

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('buildDate');
		expect(res.body).toHaveProperty('commitHash');
	});
});
