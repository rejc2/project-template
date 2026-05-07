import { parse as parseLocale } from 'bcp-47';

import { addCountryFallbacks } from './addCountryFallbacks';
import { addMissingScriptTag } from './addMissingScriptTag';
import { parseAcceptLanguage } from './parseAcceptLanguage';
import { type StrictSchema, hasLanguage, isNonNullish } from './types';

// Canonicalises subtag case per BCP-47: language/extlang/variants lowercase,
// script title-case, region uppercase (numeric regions are left untouched).
function normalizeTags(schema: StrictSchema): StrictSchema {
	return {
		...schema,
		language: schema.language.toLowerCase(),
		extendedLanguageSubtags: schema.extendedLanguageSubtags.map((tag) => tag.toLowerCase()),
		script:
			schema.script == null
				? schema.script
				: schema.script.charAt(0).toUpperCase() + schema.script.slice(1).toLowerCase(),
		region: schema.region == null ? schema.region : schema.region.toUpperCase(),
		variants: schema.variants.map((tag) => tag.toLowerCase()),
	};
}

type TemporaryAvailableItem<TLocale extends string> = {
	original: TLocale;
	parsed: StrictSchema;
};

type NestedArray<T> = T | NestedArray<T>[];

export type AcceptedLocales = NestedArray<string>;

function flatten<T>(nestedArray: T extends unknown[] ? never : NestedArray<T>): T[] {
	if (!Array.isArray(nestedArray)) {
		return [nestedArray as T];
	}

	return nestedArray.flat() as T[];
}

export function pickLocale<TLocale extends string>({
	accept,
	available,
}: {
	accept: AcceptedLocales;
	available: TLocale[];
}): TLocale | null {
	const firstAcceptList = flatten(accept)
		.flatMap((a) => parseAcceptLanguage(a))
		.map((locale) => parseLocale(locale, { normalize: true, forgiving: true }))
		.filter(hasLanguage)
		.map(normalizeTags);
	const acceptList = addCountryFallbacks(
		firstAcceptList.flatMap((item) => addMissingScriptTag(item, { schemaList: firstAcceptList })),
	);

	const firstAvailableList = available
		.map((locale): null | TemporaryAvailableItem<TLocale> => {
			const parsed = parseLocale(locale, { normalize: true });
			if (!hasLanguage(parsed)) {
				return null;
			}
			return {
				original: locale,
				parsed: normalizeTags(parsed),
			};
		})
		.filter(isNonNullish);
	const availableList = firstAvailableList.flatMap((item) =>
		addMissingScriptTag(item.parsed, { applyDefaultRegion: true }).map((parsed) => ({
			...item,
			parsed,
		})),
	);

	const availableByLanguage = new Map<string, TemporaryAvailableItem<TLocale>[]>();
	for (const available of availableList) {
		let list = availableByLanguage.get(available.parsed.language);
		if (list == null) {
			list = [];
			availableByLanguage.set(available.parsed.language, list);
		}
		list.push(available);
	}

	for (const accept of acceptList) {
		const candidates = availableByLanguage.get(accept.language);
		if (candidates == null) {
			continue;
		}
		const match = candidates.find((candidate) => isCompatible(accept, candidate.parsed));
		if (match != null) {
			return match.original;
		}
	}

	return null;
}

function isCompatible(a: StrictSchema, b: StrictSchema): boolean {
	return (
		tagsCompatible(a.script, b.script) &&
		tagsCompatible(a.region, b.region) &&
		arrayTagsCompatible(a.variants, b.variants) &&
		arrayTagsCompatible(a.extendedLanguageSubtags, b.extendedLanguageSubtags)
	);
}

function tagsCompatible(a: null | string | undefined, b: null | string | undefined): boolean {
	return a == null || b == null || a === b;
}

function arrayTagsCompatible(a: string[], b: string[]): boolean {
	if (a.length === 0 || b.length === 0) {
		return true;
	}
	return a.length === b.length && a.every((value, index) => value === b[index]);
}
