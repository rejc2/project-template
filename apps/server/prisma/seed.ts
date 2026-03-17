import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/prisma/generated/client/client.js';

try {
	process.loadEnvFile('.env');
} catch {
	// .env may not exist in all environments
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

const books = [
	{ title: 'The Hobbit', authors: ['J.R.R. Tolkien'] },
	{ title: 'The Lord of the Rings', authors: ['J.R.R. Tolkien'] },
	{ title: 'Dune', authors: ['Frank Herbert'] },
	{ title: 'Dune Messiah', authors: ['Frank Herbert'] },
	{ title: 'Neuromancer', authors: ['William Gibson'] },
	{ title: 'Good Omens', authors: ['Terry Pratchett', 'Neil Gaiman'] },
	{ title: 'The Name of the Wind', authors: ['Patrick Rothfuss'] },
	{ title: 'The Way of Kings', authors: ['Brandon Sanderson'] },
	{ title: 'Foundation', authors: ['Isaac Asimov'] },
	{ title: 'The Hitchhiker’s Guide to the Galaxy', authors: ['Douglas Adams'] },
	{ title: 'Snow Crash', authors: ['Neal Stephenson'] },
	{ title: 'Hyperion', authors: ['Dan Simmons'] },
	{ title: 'The Fall of Hyperion', authors: ['Dan Simmons'] },
	{ title: 'A Fire Upon the Deep', authors: ['Vernor Vinge'] },
	{ title: 'The Left Hand of Darkness', authors: ['Ursula K. Le Guin'] },
	{ title: 'The Dispossessed', authors: ['Ursula K. Le Guin'] },
	{ title: 'Ender’s Game', authors: ['Orson Scott Card'] },
	{ title: 'Speaker for the Dead', authors: ['Orson Scott Card'] },
	{ title: 'Childhood’s End', authors: ['Arthur C. Clarke'] },
	{ title: '2001: A Space Odyssey', authors: ['Arthur C. Clarke'] },
	{ title: 'Rendezvous with Rama', authors: ['Arthur C. Clarke'] },
	{ title: 'The Martian Chronicles', authors: ['Ray Bradbury'] },
	{ title: 'Fahrenheit 451', authors: ['Ray Bradbury'] },
	{ title: 'Slaughterhouse-Five', authors: ['Kurt Vonnegut'] },
	{ title: 'The Stars My Destination', authors: ['Alfred Bester'] },
	{ title: 'Lord of Light', authors: ['Roger Zelazny'] },
	{ title: 'The Wizard of Earthsea', authors: ['Ursula K. Le Guin'] },
	{ title: 'American Gods', authors: ['Neil Gaiman'] },
	{ title: 'Stardust', authors: ['Neil Gaiman'] },
	{ title: 'The Colour of Magic', authors: ['Terry Pratchett'] },
	{ title: 'Small Gods', authors: ['Terry Pratchett'] },
	{ title: 'Mort', authors: ['Terry Pratchett'] },
	{ title: 'The Final Empire', authors: ['Brandon Sanderson'] },
	{ title: 'The Well of Ascension', authors: ['Brandon Sanderson'] },
	{ title: 'Words of Radiance', authors: ['Brandon Sanderson'] },
	{ title: 'The Wise Man’s Fear', authors: ['Patrick Rothfuss'] },
	{ title: 'The Lion, the Witch and the Wardrobe', authors: ['C.S. Lewis'] },
	{ title: 'A Wizard of Earthsea', authors: ['Ursula K. Le Guin'] },
	{ title: 'The Two Towers', authors: ['J.R.R. Tolkien'] },
	{ title: 'The Return of the King', authors: ['J.R.R. Tolkien'] },
];

// Collect all unique author names and upsert them first
const allAuthorNames = [...new Set(books.flatMap((b) => b.authors))];
const authorByName = new Map<string, string>();

for (const name of allAuthorNames) {
	const author = await prisma.authorExample.upsert({
		where: { name },
		update: {},
		create: { name },
	});
	authorByName.set(name, author.id);
}

for (const { title, authors } of books) {
	const existing = await prisma.bookExample.findFirst({ where: { title } });
	if (existing) continue;

	await prisma.bookExample.create({
		data: {
			title,
			authors: {
				create: authors.map((name) => ({ authorId: authorByName.get(name)! })),
			},
		},
	});
	console.info(`Seeded: ${title}`);
}

await prisma.$disconnect();
