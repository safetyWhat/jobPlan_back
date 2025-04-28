/*
  Warnings:

  - You are about to drop the column `driveTimeType` on the `Job` table. All the data in the column will be lost.
  - The `driveTime` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DriveTime" AS ENUM ('NONE', 'STANDARD', 'PLUS');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "driveTimeType",
DROP COLUMN "driveTime",
ADD COLUMN     "driveTime" "DriveTime" DEFAULT 'NONE';

-- DropEnum
DROP TYPE "DriveTimeType";
