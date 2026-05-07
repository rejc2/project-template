import { type StrictSchema, isNonNullish } from './types';

export function addMissingScriptTag(
	schema: StrictSchema,
	{
		schemaList = [],
		applyDefaultRegion = false,
	}: { schemaList?: StrictSchema[]; applyDefaultRegion?: boolean } = {},
): StrictSchema[] {
	if (schema.script) {
		return [schema];
	}

	switch (schema.language) {
		case 'zh': {
			let scripts: (null | string)[];
			if (schema.region == null && !applyDefaultRegion) {
				scripts = [
					...new Set(
						schemaList
							.filter((s) => s.language === 'zh')
							.flatMap((s) => addMissingScriptTag(s).map((ss) => ss.script))
							.filter(isNonNullish),
					),
				];
			} else {
				switch (schema.region ?? 'CN') {
					case 'CN':
					case 'SG':
					case 'MY':
						scripts = ['Hans'];
						break;
					default:
						scripts = ['Hant'];
						break;
				}
			}
			if (scripts.length > 0) {
				return scripts.map((script) => ({ ...schema, script }));
			} else {
				return [schema];
			}
		}

		default:
			return [schema];
	}
}
