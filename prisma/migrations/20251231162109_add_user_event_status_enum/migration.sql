-- CreateEnum
CREATE TYPE "UserEventStatus" AS ENUM ('JOINED', 'INTERESTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "status" "UserEventStatus" NOT NULL DEFAULT 'INTERESTED';
