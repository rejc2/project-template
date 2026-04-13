-- AlterTable
ALTER TABLE "BookExample" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "BookExample_title_idx" ON "BookExample"("title");
