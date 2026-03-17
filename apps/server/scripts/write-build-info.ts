import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

let commitHash: null | string;
try {
	const { stdout } = await execAsync('git rev-parse --short HEAD');
	commitHash = stdout.trim();
} catch {
	commitHash = null;
}

const info = {
	buildDate: new Date().toISOString(),
	commitHash,
};

await writeFile(join(__dirname, '../src/build-info.json'), JSON.stringify(info, null, 2) + '\n');

process.stdout.write(`Build info generated: ${JSON.stringify(info)}\n`);
