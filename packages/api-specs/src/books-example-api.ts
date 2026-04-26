import { z } from 'zod';

export const BookSchema = z.object({
	id: z.string(),
	title: z.string(),
	authors: z.array(z.string()),
	description: z.string().nullable(),
});
export type Book = z.infer<typeof BookSchema>;

// /api/book/:id

export const GetBookResponseSchema = z.object({
	book: BookSchema,
});
export type GetBookResponse = z.infer<typeof GetBookResponseSchema>;

// /api/books

export const BookItemSchema = BookSchema.pick({ id: true, title: true, authors: true });
export type BookItem = z.infer<typeof BookItemSchema>;

export const GetBooksParamsSchema = z.object({
	first: z
		.union([z.number(), z.string().transform(Number)])
		.pipe(z.number().int().positive())
		.optional(),
	after: z.string().optional(),
});
export type GetBooksParams = z.infer<typeof GetBooksParamsSchema>;

export const GetBooksResponseSchema = z.object({
	books: z.array(BookItemSchema),
	endCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});
export type GetBooksResponse = z.infer<typeof GetBooksResponseSchema>;
