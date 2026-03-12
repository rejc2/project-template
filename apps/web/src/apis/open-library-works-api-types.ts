// https://openlibrary.org/dev/docs/api#anchor_works
// Example: https://openlibrary.org/works/OL45804W.json
import { z } from 'zod';

const olKeySchema = z.object({ key: z.string() });

const olDateTimeSchema = z.object({
	type: z.literal('/type/datetime'),
	value: z.string(),
});

const olTextSchema = z.object({
	type: z.literal('/type/text'),
	value: z.string(),
});

const olAuthorRoleSchema = z.object({
	author: olKeySchema,
	type: olKeySchema,
});

export const openLibraryAuthorSchema = z.object({
	key: z.string(),
	name: z.string(),
	personal_name: z.string().optional(),
});
export type OpenLibraryAuthor = z.infer<typeof openLibraryAuthorSchema>;

export const openLibraryWorkSchema = z.object({
	key: z.string(),
	title: z.string(),
	type: olKeySchema,

	// Description may be a plain string or a typed text object
	description: z.union([z.string(), olTextSchema]).optional(),

	authors: z.array(olAuthorRoleSchema).optional(),
	covers: z.array(z.number().int()).optional(),

	subjects: z.array(z.string()).optional(),
	subject_places: z.array(z.string()).optional(),
	subject_people: z.array(z.string()).optional(),
	subject_times: z.array(z.string()).optional(),

	location: z.string().optional(),

	latest_revision: z.number().int().optional(),
	revision: z.number().int().optional(),
	created: olDateTimeSchema.optional(),
	last_modified: olDateTimeSchema.optional(),
});
export type OpenLibraryWork = z.infer<typeof openLibraryWorkSchema>;
