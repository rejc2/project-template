import { type Schema } from 'bcp-47';

export type StrictSchema = Schema & { language: NonNullable<Schema['language']> };

export function hasLanguage(schema: Schema): schema is StrictSchema {
	return schema.language != null;
}

export function isNonNullish<T>(value: T): value is NonNullable<T> {
	return value != null;
}
