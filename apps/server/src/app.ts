import cors from 'cors';
import express, { type NextFunction, type Request, type Response, Router } from 'express';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { contextMiddleware } from './context/contextMiddleware.ts';
import { healthRouter } from './health/healthRouter.ts';
import { booksExampleRouter } from './routes/booksExampleRouter.ts';
import { sessionMiddleware } from './session/sessionMiddleware.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
	app.use(cors({ origin: corsOrigin, credentials: true }));
} else {
	console.warn('Warning: No CORS origin set');
}
app.use(express.json());
app.use(contextMiddleware);
app.use(sessionMiddleware);

app.get('/', (_req: Request, res: Response) => {
	res.json({ message: 'projecttemplate server is running' });
});

app.use('/health', healthRouter);

app.get('/version', async (_req: Request, res: Response) => {
	try {
		const info = JSON.parse(await readFile(join(__dirname, 'build-info.json'), 'utf-8'));
		res.json(info);
	} catch {
		res.json({ buildDate: null, commitHash: null });
	}
});

const apiRouter = Router();
app.use('/api', apiRouter);

apiRouter.use('/books-example', booksExampleRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);
	res.status(500).json({ error: err.message });
});
