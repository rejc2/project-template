// polyfills.ts must come first
import '@/polyfills.ts';

import { app } from './app.ts';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.info(`Server listening on port ${port}`);
});
