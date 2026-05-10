import { parse as parseLocale } from 'bcp-47';
import { describe, expect, it } from 'vitest';

import { addMissingScriptTag } from './addMissingScriptTag';
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

describe('addMissingScriptTag', () => {
	describe('with applyDefaultRegion', () => {
		it('adds simplified script to plain zh', () => {
			const schema = parse('zh');
			expect(addMissingScriptTag(schema, { applyDefaultRegion: true })).toEqual(
				parseAll(['zh-Hans']),
			);
		});

		it('leaves a schema with an existing script unchanged', () => {
			const schema = parse('zh-Bopo');
			expect(addMissingScriptTag(schema)).toEqual([schema]);
		});

		it('applies simplified script to Singapore', () => {
			const schema = parse('zh-SG');
			expect(addMissingScriptTag(schema, { applyDefaultRegion: true })).toEqual(
				parseAll(['zh-Hans-SG']),
			);
		});

		it('applies tradiional script to arbitrary countries', () => {
			const schema = parse('zh-XY');
			expect(addMissingScriptTag(schema, { applyDefaultRegion: true })).toEqual(
				parseAll(['zh-Hant-XY']),
			);
		});
	});

	describe('without applyDefaultRegion', () => {
		it('keeps plain zh plain', () => {
			const schema = parse('zh');
			expect(addMissingScriptTag(schema)).toEqual(parseAll(['zh']));
		});
	});

	describe('with accept list, no applyDefaultRegion', () => {
		it('keeps plain zh plain', () => {
			const schemaList = parseAll(['zh']);
			const schema = parse('zh');
			expect(addMissingScriptTag(schema, { schemaList })).toEqual(parseAll(['zh']));
		});

		it('uses other optons as script preferences', () => {
			const schemaList = parseAll(['zh-HK', 'zh-CN', 'zh']);
			const schema = parse('zh');
			expect(addMissingScriptTag(schema, { schemaList })).toEqual(
				parseAll(['zh-Hant', 'zh-Hans']),
			);
		});

		it('uses single other opton as script preferences', () => {
			const schemaList = parseAll(['zh-HK', 'zh']);
			const schema = parse('zh');
			expect(addMissingScriptTag(schema, { schemaList })).toEqual(parseAll(['zh-Hant']));
		});

		it('ignore other languages with script tags', () => {
			const schemaList = parseAll(['yue-Hant', 'zh-Hans-CN', 'zh']);
			const schema = parse('zh');
			expect(addMissingScriptTag(schema, { schemaList })).toEqual(parseAll(['zh-Hans']));
		});
	});
});
