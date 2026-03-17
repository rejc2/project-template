-- CreateTable
CREATE TABLE "BookExample" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorExample" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AuthorExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookExampleAuthorLink" (
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "BookExampleAuthorLink_pkey" PRIMARY KEY ("bookId","authorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorExample_name_key" ON "AuthorExample"("name");

-- AddForeignKey
ALTER TABLE "BookExampleAuthorLink" ADD CONSTRAINT "BookExampleAuthorLink_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookExample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookExampleAuthorLink" ADD CONSTRAINT "BookExampleAuthorLink_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AuthorExample"("id") ON DELETE CASCADE ON UPDATE CASCADE;
