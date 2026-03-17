import {
	type GetBookResponse,
	type GetBooksParams,
	GetBooksParamsSchema,
	type GetBooksResponse,
} from '@rejc2/project-template-api-specs/books-example';
import { type Request, type Response, Router } from 'express';

import { getPrisma } from '@/prisma/db.ts';

export const booksExampleRouter = Router();

type ErrorResponse = { error: string };

booksExampleRouter.get(
	'/',
	async (
		req: Request<object, GetBooksResponse, never, GetBooksParams>,
		res: Response<GetBooksResponse>,
	) => {
		const prisma = getPrisma();
		const { first, after } = GetBooksParamsSchema.parse(req.query);
		const take = first ?? 20;
		const books = await prisma.bookExample.findMany({
			orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
			take: take + 1,
			include: { bookAuthorExamples: true },
			...(after ? { cursor: { id: after }, skip: 1 } : {}),
		});
		const hasNextPage = books.length > take;
		const page = hasNextPage ? books.slice(0, take) : books;
		res.json({
			books: page.map((b) => ({
				id: b.id,
				title: b.title,
				authors: b.bookAuthorExamples.map((a) => a.name),
			})),
			endCursor: page.length > 0 ? (page[page.length - 1]?.id ?? null) : null,
			hasNextPage,
		});
	},
);

booksExampleRouter.get(
	'/:bookId',
	async (req: Request<{ bookId: string }>, res: Response<GetBookResponse | ErrorResponse>) => {
		const prisma = getPrisma();
		const { bookId } = req.params;
		const book = await prisma.bookExample.findUnique({
			where: { id: bookId },
			include: { bookAuthorExamples: true },
		});
		if (!book) {
			res.status(404).json({ error: 'Book not found' });
			return;
		}
		res.json({
			book: {
				id: book.id,
				title: book.title,
				authors: book.bookAuthorExamples.map((a) => a.name),
			},
		});
	},
);
