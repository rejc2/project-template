import express, { type Router } from 'express';
import path from 'path';

export function getFrontEndRouter(distPath: string): Router {
	const frontEndRouter = express.Router();

	// 1. Serve static files
	frontEndRouter.use(express.static(path.resolve(distPath)));

	// 2. SPA fallback
	frontEndRouter.get('{*path}', (_req, res) => {
		res.sendFile(path.resolve(distPath, 'index.html'));
	});

	return frontEndRouter;
}
