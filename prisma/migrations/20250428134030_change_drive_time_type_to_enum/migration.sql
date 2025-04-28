/*
  Warnings:

  - You are about to drop the column `driveTimeTypeId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `DriveTime` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DriveTimeType" AS ENUM ('STANDARD', 'PLUS');

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_driveTimeTypeId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "driveTimeTypeId",
ADD COLUMN     "driveTimeType" "DriveTimeType";

-- DropTable
DROP TABLE "DriveTime";
