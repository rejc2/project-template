// Parses an Accept-Language header per RFC 9110 §12.5.4
// (https://www.rfc-editor.org/rfc/rfc9110#name-accept-language).
export function parseAcceptLanguage(acceptLanguage: string): string[] {
	return acceptLanguage
		.split(',')
		.map((entry, index) => {
			const [rawLocale, ...params] = entry.split(';');
			const locale = rawLocale.trim();
			let quality = 1;
			for (const param of params) {
				const [key, value] = param.split('=');
				if (key?.trim().toLowerCase() === 'q' && value !== undefined) {
					const parsed = Number.parseFloat(value.trim());
					if (Number.isFinite(parsed)) {
						quality = parsed;
					}
				}
			}
			return { locale, quality, index };
		})
		.filter(({ locale, quality }) => locale.length > 0 && quality > 0)
		.sort((a, b) => b.quality - a.quality || a.index - b.index)
		.map(({ locale }) => locale);
}
