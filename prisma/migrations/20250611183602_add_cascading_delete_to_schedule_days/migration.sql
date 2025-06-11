-- DropForeignKey
ALTER TABLE "OperatorCount" DROP CONSTRAINT "OperatorCount_scheduledDateId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledDate" DROP CONSTRAINT "ScheduledDate_scheduledJobId_fkey";

-- AddForeignKey
ALTER TABLE "OperatorCount" ADD CONSTRAINT "OperatorCount_scheduledDateId_fkey" FOREIGN KEY ("scheduledDateId") REFERENCES "ScheduledDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledDate" ADD CONSTRAINT "ScheduledDate_scheduledJobId_fkey" FOREIGN KEY ("scheduledJobId") REFERENCES "ScheduledJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
