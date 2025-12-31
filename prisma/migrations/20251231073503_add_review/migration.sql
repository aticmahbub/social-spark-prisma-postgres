/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewerId,eventId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "createdAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "hostId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_eventId_key" ON "Review"("reviewerId", "eventId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
