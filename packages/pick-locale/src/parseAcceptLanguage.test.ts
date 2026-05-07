import { describe, expect, it } from 'vitest';

import { parseAcceptLanguage } from './parseAcceptLanguage';

describe('parseAcceptLanguage', () => {
	it('returns a single locale', () => {
		expect(parseAcceptLanguage('en-US')).toEqual(['en-US']);
	});

	it('returns multiple locales in input order when no q values are given', () => {
		expect(parseAcceptLanguage('en-US,en,fr')).toEqual(['en-US', 'en', 'fr']);
	});

	it('orders locales by descending quality', () => {
		expect(parseAcceptLanguage('fr;q=0.5,en;q=0.9,de;q=0.7')).toEqual(['en', 'de', 'fr']);
	});

	it('treats missing q as 1.0', () => {
		expect(parseAcceptLanguage('fr;q=0.5,en,de;q=0.7')).toEqual(['en', 'de', 'fr']);
	});

	it('preserves input order for ties (stable sort)', () => {
		expect(parseAcceptLanguage('en;q=0.8,fr;q=0.8,de;q=0.8')).toEqual(['en', 'fr', 'de']);
	});

	it('drops entries with q=0', () => {
		expect(parseAcceptLanguage('en,fr;q=0,de;q=0.5')).toEqual(['en', 'de']);
	});

	it('trims surrounding whitespace around locales and parameters', () => {
		expect(parseAcceptLanguage('  en-US , fr ; q=0.8 , de;q=0.5')).toEqual(['en-US', 'fr', 'de']);
	});

	it('is case-insensitive on the q parameter key', () => {
		expect(parseAcceptLanguage('en;Q=0.5,fr;q=0.9')).toEqual(['fr', 'en']);
	});

	it('drops empty entries', () => {
		expect(parseAcceptLanguage('en,,fr')).toEqual(['en', 'fr']);
	});

	it('returns an empty array for an empty header', () => {
		expect(parseAcceptLanguage('')).toEqual([]);
	});

	it('handles the wildcard locale', () => {
		expect(parseAcceptLanguage('en;q=0.9,*;q=0.1')).toEqual(['en', '*']);
	});

	it('ignores unknown parameters and keeps q', () => {
		expect(parseAcceptLanguage('en;foo=bar;q=0.4,fr;q=0.7')).toEqual(['fr', 'en']);
	});

	it('falls back to q=1 when q is not a finite number', () => {
		expect(parseAcceptLanguage('en;q=abc,fr;q=0.5')).toEqual(['en', 'fr']);
	});
});
