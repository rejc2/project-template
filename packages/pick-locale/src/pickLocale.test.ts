import { describe, expect, it } from 'vitest';

import { pickLocale } from './pickLocale';

describe('pickLocale', () => {
	it('returns an exact match', () => {
		expect(pickLocale({ accept: 'en-US', available: ['en-US', 'fr-FR'] })).toBe('en-US');
	});

	it('returns null when no language matches', () => {
		expect(pickLocale({ accept: 'de', available: ['en-US', 'fr-FR'] })).toBe(null);
	});

	it('returns null when no available locales are given', () => {
		expect(pickLocale({ accept: 'en-US', available: [] })).toBe(null);
	});

	it('returns null when the accept header is empty', () => {
		expect(pickLocale({ accept: '', available: ['en-US'] })).toBe(null);
	});

	it('matches by language when the available locale has no region', () => {
		expect(pickLocale({ accept: 'en-US', available: ['en', 'fr'] })).toBe('en');
	});

	it('matches by language when the accept locale has no region', () => {
		expect(pickLocale({ accept: 'en', available: ['en-US', 'fr-FR'] })).toBe('en-US');
	});

	it('falls back to region on the same language', () => {
		expect(pickLocale({ accept: 'en-US', available: ['en-GB'] })).toBe('en-GB');
	});

	it('prefers the highest-quality accept entry that has a match', () => {
		expect(
			pickLocale({
				accept: 'de;q=1.0,fr;q=0.9,en;q=0.8',
				available: ['en-US', 'fr-FR'],
			}),
		).toBe('fr-FR');
	});

	it('respects accept-list order when no q values are given', () => {
		expect(
			pickLocale({
				accept: 'fr,en',
				available: ['en-US', 'fr-FR'],
			}),
		).toBe('fr-FR');
	});

	it('skips q=0 entries even if a matching locale is available', () => {
		expect(
			pickLocale({
				accept: 'en;q=0,fr',
				available: ['en-US', 'fr-FR'],
			}),
		).toBe('fr-FR');
	});

	it('accepts an array of locales instead of a header string', () => {
		expect(pickLocale({ accept: ['fr', 'en'], available: ['en-US', 'fr-FR'] })).toBe('fr-FR');
	});

	it('returns the first available locale when multiple are compatible', () => {
		expect(pickLocale({ accept: 'en', available: ['en-US', 'en-GB'] })).toBe('en-US');
	});

	describe('Chinese script handling', () => {
		it('maps zh-CN to zh-Hans', () => {
			expect(pickLocale({ accept: 'zh-CN', available: ['zh-Hans', 'zh-Hant'] })).toBe('zh-Hans');
		});

		it('maps zh-SG to zh-Hans', () => {
			expect(pickLocale({ accept: 'zh-SG', available: ['zh-Hans', 'zh-Hant'] })).toBe('zh-Hans');
		});

		it('maps zh-TW to zh-Hant', () => {
			expect(pickLocale({ accept: 'zh-TW', available: ['zh-Hans', 'zh-Hant'] })).toBe('zh-Hant');
		});

		it('maps zh-HK to zh-Hant', () => {
			expect(pickLocale({ accept: 'zh-HK', available: ['zh-Hans', 'zh-Hant'] })).toBe('zh-Hant');
		});

		it('maps zh-HK,zh to zh-TW', () => {
			expect(pickLocale({ accept: 'zh-HK,zh;q=0.9', available: ['zh', 'zh-TW'] })).toBe('zh-TW');
		});

		it('matches bare zh against the first available script', () => {
			expect(pickLocale({ accept: 'zh', available: ['zh-Hant', 'zh-Hans'] })).toBe('zh-Hant');
		});
	});

	it('falls back to the next accept-language when the preferred has no match', () => {
		expect(
			pickLocale({
				accept: 'de,fr;q=0.9,en;q=0.8',
				available: ['en-US'],
			}),
		).toBe('en-US');
	});

	it('handles whitespace in accept header', () => {
		expect(
			pickLocale({
				accept: '  fr-FR , en-US ; q=0.5 ',
				available: ['en-US', 'fr-FR'],
			}),
		).toBe('fr-FR');
	});

	describe('case insensitivity', () => {
		it('matches when the accept language is uppercase', () => {
			expect(pickLocale({ accept: 'EN-US', available: ['en-US'] })).toBe('en-US');
		});

		it('matches when the accept region differs in case', () => {
			expect(pickLocale({ accept: 'en-us', available: ['en-US'] })).toBe('en-US');
		});

		it('matches when the available locale is non-canonical case', () => {
			expect(pickLocale({ accept: 'en-US', available: ['EN-us'] })).toBe('EN-us');
		});

		it('matches when both sides use non-canonical case', () => {
			expect(pickLocale({ accept: 'FR-fr', available: ['fr-FR'] })).toBe('fr-FR');
		});

		it('matches script subtags case-insensitively', () => {
			expect(pickLocale({ accept: 'zh-hans', available: ['zh-Hans', 'zh-Hant'] })).toBe(
				'zh-Hans',
			);
		});

		it('maps lowercase zh-cn to zh-Hans', () => {
			expect(pickLocale({ accept: 'zh-cn', available: ['zh-Hans', 'zh-Hant'] })).toBe('zh-Hans');
		});
	});
});
