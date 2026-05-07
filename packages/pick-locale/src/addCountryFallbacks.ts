import { type StrictSchema } from './types';

function schemaKey(schema: StrictSchema): string {
	return JSON.stringify([
		schema.language,
		schema.extendedLanguageSubtags,
		schema.script ?? null,
		schema.region ?? null,
		schema.variants,
		schema.extensions,
		schema.privateuse,
	]);
}

export function addCountryFallbacks(accept: StrictSchema[]): StrictSchema[] {
	const existingKeys = new Set(accept.map(schemaKey));
	const addedKeys = new Set<string>();
	const fallbacksByIndex = new Map<number, StrictSchema[]>();

	for (const schema of accept) {
		if (schema.region == null) {
			continue;
		}
		const fallback: StrictSchema = {
			...schema,
			region: null,
			variants: [],
			extensions: [],
			privateuse: [],
		};
		const key = schemaKey(fallback);
		if (existingKeys.has(key) || addedKeys.has(key)) {
			continue;
		}
		addedKeys.add(key);

		let insertAfter = -1;
		for (let i = 0; i < accept.length; i++) {
			const candidate = accept[i];
			if (
				candidate.language === schema.language &&
				(candidate.script ?? null) === (schema.script ?? null)
			) {
				insertAfter = i;
			}
		}

		const list = fallbacksByIndex.get(insertAfter) ?? [];
		list.push(fallback);
		fallbacksByIndex.set(insertAfter, list);
	}

	if (addedKeys.size === 0) {
		return accept;
	}

	const result: StrictSchema[] = [];
	for (let i = 0; i < accept.length; i++) {
		result.push(accept[i]);
		const fallbacks = fallbacksByIndex.get(i);
		if (fallbacks) {
			result.push(...fallbacks);
		}
	}
	return result;
}
