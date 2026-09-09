#!/usr/bin/env node
// Validates all YAML files that carry a yaml-language-server $schema annotation.
// Usage: node scripts/validate-yaml-schemas.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseJsonc, printParseErrorCode } from 'jsonc-parser';
import { parse as parseYaml } from 'yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const IGNORE_DIRS = new Set(['.git', '.sl', '.yarn', 'node_modules']);

function getExtensionRegex(extensions) {
	return new RegExp(`\\.(${[...extensions].map((ext) => RegExp.escape(ext)).join('|')})$`);
}

const yamlFileExtensions = ['yaml', 'yml'];
const yamlFileNameRegex = getExtensionRegex(yamlFileExtensions);
const jsonFileExtensions = ['json'];
const jsonFileNameRegex = getExtensionRegex(jsonFileExtensions);

const yamlJsonFileNameRegex = getExtensionRegex([...jsonFileExtensions, ...yamlFileExtensions]);

async function* findYamlFiles(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (!IGNORE_DIRS.has(entry.name)) yield* findYamlFiles(join(dir, entry.name));
		} else if (yamlJsonFileNameRegex.test(entry.name)) {
			yield join(dir, entry.name);
		}
	}
}

const ajv = new Ajv({ strict: false, allErrors: true, validateSchema: false });
addFormats(ajv);

const schemaCache = new Map();

async function fetchSchema(url) {
	if (schemaCache.has(url)) return schemaCache.get(url);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${url}`);
	const schema = await res.json();
	schemaCache.set(url, schema);
	return schema;
}

let validated = 0;
let skipped = 0;
let failed = 0;

const yamlFiles = [];
for await (const file of findYamlFiles(ROOT)) yamlFiles.push(file);
yamlFiles.sort();

for (const filePath of yamlFiles) {
	try {
		const rel = relative(ROOT, filePath);
		const content = await readFile(filePath, 'utf8');

		let schemaUrl = undefined;
		let data = undefined;
		if (jsonFileNameRegex.test(filePath)) {
			const parseErrors = [];
			data = parseJsonc(content, parseErrors, { allowTrailingComma: true });
			if (parseErrors.length > 0) {
				const [{ error, offset }] = parseErrors;
				throw new Error(`JSONC parse error: ${printParseErrorCode(error)} at offset ${offset}`);
			}
			const schemaField = data?.['$schema'];
			if (typeof schemaField === 'string') {
				schemaUrl = schemaField;
			}
		} else if (yamlFileNameRegex.test(filePath)) {
			const match = content.match(/^# yaml-language-server: \$schema=(.+)$/m);
			schemaUrl = match?.[1].trim() || null;
			data = parseYaml(content);
		}

		if (schemaUrl == null) {
			skipped++;
			continue;
		}

		process.stdout.write(`checking ${rel} ... `);

		const schema = await fetchSchema(schemaUrl);
		const validate = ajv.compile(schema);

		if (validate(data)) {
			process.stdout.write('ok\n');
			validated++;
		} else {
			process.stdout.write('FAIL\n');
			for (const { instancePath, message } of validate.errors ?? []) {
				process.stderr.write(`  ${instancePath || '(root)'}: ${message}\n`);
			}
			failed++;
		}
	} catch (err) {
		process.stdout.write(`ERROR processing ${filePath}:\n`);
		process.stderr.write(`  ${err.message}\n`);
		failed++;
	}
}

process.stdout.write(`\n${validated} validated, ${skipped} skipped, ${failed} failed\n`);
if (failed > 0) process.exit(1);
