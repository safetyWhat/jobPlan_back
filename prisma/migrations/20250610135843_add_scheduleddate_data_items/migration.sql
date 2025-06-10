-- CreateEnum
CREATE TYPE "OperatorType" AS ENUM ('NONE', 'FULL', 'BOBCAT', 'DOZER');

-- CreateEnum
CREATE TYPE "OtherIdentifier" AS ENUM ('NONE', 'TIME_AND_MATERIALS', 'TEN_DAY', 'GRINDING');

-- AlterTable
ALTER TABLE "ScheduledDate" ADD COLUMN     "crewSize" INTEGER,
ADD COLUMN     "otherIdentifier" "OtherIdentifier"[] DEFAULT ARRAY['NONE']::"OtherIdentifier"[];

-- CreateTable
CREATE TABLE "OperatorCount" (
    "id" SERIAL NOT NULL,
    "type" "OperatorType" NOT NULL DEFAULT 'NONE',
    "count" INTEGER,
    "scheduledDateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorCount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OperatorCount" ADD CONSTRAINT "OperatorCount_scheduledDateId_fkey" FOREIGN KEY ("scheduledDateId") REFERENCES "ScheduledDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
