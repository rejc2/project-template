// https://openlibrary.org/dev/docs/api/search
// Note: the schema is not guaranteed to be stable per Open Library docs.
// All fields are optional except `key` and `title`.
import { z } from 'zod';

export const openLibraryEditionDocSchema = z.object({
	key: z.string(),
	title: z.string().optional(),
	language: z.array(z.string()).optional(),
	ebook_access: z.string().optional(),
});
export type OpenLibraryEditionDoc = z.infer<typeof openLibraryEditionDocSchema>;

// Returned when `fields=editions` is requested
export const openLibraryEditionsSchema = z.object({
	numFound: z.number().int(),
	start: z.number().int(),
	docs: z.array(openLibraryEditionDocSchema),
});
export type OpenLibraryEditions = z.infer<typeof openLibraryEditionsSchema>;

export const openLibrarySearchDocSchema = z.object({
	key: z.string(),
	title: z.string(),
	title_sort: z.string().optional(),
	title_suggest: z.string().optional(),
	type: z.string().optional(),

	// Authors
	author_key: z.array(z.string()).optional(),
	author_name: z.array(z.string()).optional(),
	author_alternative_name: z.array(z.string()).optional(),
	author_facet: z.array(z.string()).optional(),

	// Editions
	edition_count: z.number().int().optional(),
	edition_key: z.array(z.string()).optional(),
	first_publish_year: z.number().int().optional(),
	publish_year: z.array(z.number().int()).optional(),
	publish_date: z.array(z.string()).optional(),
	number_of_pages_median: z.number().int().optional(),

	// Publishing
	publisher: z.array(z.string()).optional(),
	publisher_facet: z.array(z.string()).optional(),
	publish_place: z.array(z.string()).optional(),
	contributor: z.array(z.string()).optional(),
	format: z.array(z.string()).optional(),
	language: z.array(z.string()).optional(),

	// Cover
	cover_i: z.number().int().optional(),
	cover_edition_key: z.string().optional(),

	// Internet Archive / ebook access
	has_fulltext: z.boolean().optional(),
	ebook_access: z.string().optional(),
	ebook_count_i: z.number().int().optional(),
	ebook_provider: z.array(z.string()).optional(),
	ia: z.array(z.string()).optional(),
	ia_collection: z.array(z.string()).optional(),
	ia_box_id: z.array(z.string()).optional(),
	lending_edition_s: z.string().optional(),
	lending_identifier_s: z.string().optional(),
	printdisabled_s: z.string().optional(),
	public_scan_b: z.boolean().optional(),
	osp_count: z.number().int().optional(),

	// Classification
	isbn: z.array(z.string()).optional(),
	lccn: z.array(z.string()).optional(),
	oclc: z.array(z.string()).optional(),
	lcc: z.array(z.string()).optional(),
	lcc_sort: z.string().optional(),
	ddc: z.array(z.string()).optional(),
	ddc_sort: z.string().optional(),

	// Subjects
	subject: z.array(z.string()).optional(),
	subject_key: z.array(z.string()).optional(),
	subject_facet: z.array(z.string()).optional(),
	place: z.array(z.string()).optional(),
	place_key: z.array(z.string()).optional(),
	place_facet: z.array(z.string()).optional(),
	person: z.array(z.string()).optional(),
	person_key: z.array(z.string()).optional(),
	person_facet: z.array(z.string()).optional(),
	time: z.array(z.string()).optional(),
	time_key: z.array(z.string()).optional(),
	time_facet: z.array(z.string()).optional(),

	// Content
	first_sentence: z.array(z.string()).optional(),
	chapter: z.array(z.string()).optional(),
	seed: z.array(z.string()).optional(),

	// Ratings
	ratings_average: z.number().optional(),
	ratings_sortable: z.number().optional(),
	ratings_count: z.number().int().optional(),
	ratings_count_1: z.number().int().optional(),
	ratings_count_2: z.number().int().optional(),
	ratings_count_3: z.number().int().optional(),
	ratings_count_4: z.number().int().optional(),
	ratings_count_5: z.number().int().optional(),

	// Reading log
	readinglog_count: z.number().int().optional(),
	want_to_read_count: z.number().int().optional(),
	currently_reading_count: z.number().int().optional(),
	already_read_count: z.number().int().optional(),

	// Trending
	trending_score_hourly_sum: z.number().int().optional(),
	trending_z_score: z.number().optional(),

	// External IDs
	id_goodreads: z.array(z.string()).optional(),
	id_librarything: z.array(z.string()).optional(),
	id_amazon: z.array(z.string()).optional(),
	id_google: z.array(z.string()).optional(),
	id_wikidata: z.array(z.string()).optional(),
	id_overdrive: z.array(z.string()).optional(),
	id_dnb: z.array(z.string()).optional(),
	id_doi: z.array(z.string()).optional(),
	id_alibris_id: z.array(z.string()).optional(),
	id_paperback_swap: z.array(z.string()).optional(),
	id_better_world_books: z.array(z.string()).optional(),
	id_canadian_national_library_archive: z.array(z.string()).optional(),

	// Misc
	last_modified_i: z.number().int().optional(),
	_version_: z.number().int().optional(),
});
export type OpenLibrarySearchDoc = z.infer<typeof openLibrarySearchDocSchema>;

export const openLibrarySearchResponseSchema = z.object({
	numFound: z.number().int(),
	/** @deprecated use numFound */
	num_found: z.number().int(),
	numFoundExact: z.boolean(),
	start: z.number().int(),
	offset: z.number().int().nullable(),
	q: z.string(),
	documentation_url: z.string(),
	docs: z.array(openLibrarySearchDocSchema),
});
export type OpenLibrarySearchResponse = z.infer<typeof openLibrarySearchResponseSchema>;
