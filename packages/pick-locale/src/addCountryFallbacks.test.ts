import { parse as parseLocale } from 'bcp-47';
import { describe, expect, it } from 'vitest';

import { addCountryFallbacks } from './addCountryFallbacks';
import { type StrictSchema, hasLanguage } from './types';

function parse(locale: string): StrictSchema {
	const schema = parseLocale(locale, { normalize: true });
	if (!hasLanguage(schema)) {
		throw new Error(`Failed to parse "${locale}" as a language tag`);
	}
	return schema;
}

function parseAll(locales: string[]): StrictSchema[] {
	return locales.map(parse);
}

describe('addCountryFallbacks', () => {
	it('returns the list unchanged when no locale has a region', () => {
		const input = parseAll(['en', 'fr', 'zh-Hans']);
		expect(addCountryFallbacks(input)).toEqual(input);
	});

	it('adds a language-only fallback for a single regional locale', () => {
		expect(addCountryFallbacks(parseAll(['en-US']))).toEqual(parseAll(['en-US', 'en']));
	});

	it('inserts the fallback after the last locale with the same language and script', () => {
		expect(addCountryFallbacks(parseAll(['en-US', 'fr-FR', 'en-GB']))).toEqual(
			parseAll(['en-US', 'fr-FR', 'fr', 'en-GB', 'en']),
		);
	});

	it('does not duplicate a fallback that already exists in the list', () => {
		expect(addCountryFallbacks(parseAll(['en-US', 'en']))).toEqual(parseAll(['en-US', 'en']));
	});

	it('does not add the same fallback twice for multiple regional variants', () => {
		expect(addCountryFallbacks(parseAll(['en-US', 'en-GB', 'en-AU']))).toEqual(
			parseAll(['en-US', 'en-GB', 'en-AU', 'en']),
		);
	});

	it('keeps the script when adding the fallback', () => {
		expect(addCountryFallbacks(parseAll(['zh-Hans-CN']))).toEqual(
			parseAll(['zh-Hans-CN', 'zh-Hans']),
		);
	});

	it('treats different scripts as distinct insertion groups', () => {
		expect(addCountryFallbacks(parseAll(['zh-Hans-CN', 'zh-Hant-TW']))).toEqual(
			parseAll(['zh-Hans-CN', 'zh-Hans', 'zh-Hant-TW', 'zh-Hant']),
		);
	});

	it('groups regional variants with the matching script-only entry', () => {
		expect(addCountryFallbacks(parseAll(['zh-Hans-CN', 'zh-Hans', 'zh-Hant-TW']))).toEqual(
			parseAll(['zh-Hans-CN', 'zh-Hans', 'zh-Hant-TW', 'zh-Hant']),
		);
	});

	it('strips variants and extensions along with the region', () => {
		expect(addCountryFallbacks(parseAll(['de-CH-1996']))).toEqual(
			parseAll(['de-CH-1996', 'de']),
		);
	});

	it('inserts the fallback at the position of the last matching language entry', () => {
		expect(addCountryFallbacks(parseAll(['en-US', 'fr-FR', 'en-GB', 'de-DE']))).toEqual(
			parseAll(['en-US', 'fr-FR', 'fr', 'en-GB', 'en', 'de-DE', 'de']),
		);
	});
});
