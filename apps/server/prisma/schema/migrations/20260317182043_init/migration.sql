-- CreateTable
CREATE TABLE "BookExample" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookExampleAuthor" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BookExampleAuthor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookExampleAuthor" ADD CONSTRAINT "BookExampleAuthor_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookExample"("id") ON DELETE CASCADE ON UPDATE CASCADE;
