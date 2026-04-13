import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/prisma/generated/client/client.js';
import { seedBooks } from './seed-data.js';

try {
	process.loadEnvFile('.env');
} catch {
	// .env may not exist in all environments
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

// Authors: find existing, insert missing
const allAuthorNames = [...new Set(seedBooks.flatMap((b) => b.authors))];

const existingAuthors = await prisma.authorExample.findMany({
	where: { name: { in: allAuthorNames } },
	select: { id: true, name: true },
});
const existingAuthorNames = new Set(existingAuthors.map((a) => a.name));
const missingAuthorNames = allAuthorNames.filter((n) => !existingAuthorNames.has(n));

const newAuthors =
	missingAuthorNames.length > 0
		? await prisma.authorExample.createManyAndReturn({
				data: missingAuthorNames.map((name) => ({ name })),
				select: { id: true, name: true },
			})
		: [];
for (const { name } of newAuthors) {
	console.info(`Seeded author: ${name}`);
}

const authorByName = new Map([...existingAuthors, ...newAuthors].map((a) => [a.name, a.id]));

// Books: find existing, insert missing
const allTitles = seedBooks.map((b) => b.title);
const existingTitles = new Set(
	(
		await prisma.bookExample.findMany({
			where: { title: { in: allTitles } },
			select: { title: true },
		})
	).map((b) => b.title),
);
const missingBooks = seedBooks.filter((b) => !existingTitles.has(b.title));

if (missingBooks.length > 0) {
	const newBooks = await prisma.bookExample.createManyAndReturn({
		data: missingBooks.map(({ title, description }) => ({ title, description })),
		select: { id: true, title: true },
	});
	const bookIdByTitle = new Map(newBooks.map((b) => [b.title, b.id]));

	await prisma.bookExampleAuthorLink.createMany({
		data: missingBooks.flatMap(({ title, authors }) =>
			authors.map((name) => ({
				bookId: bookIdByTitle.get(title)!,
				authorId: authorByName.get(name)!,
			})),
		),
	});

	for (const { title } of newBooks) {
		console.info(`Seeded book: ${title}`);
	}
}

await prisma.$disconnect();
