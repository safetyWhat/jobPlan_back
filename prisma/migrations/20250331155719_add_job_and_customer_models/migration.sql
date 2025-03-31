-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "jobName" TEXT NOT NULL,
    "jobNum" TEXT,
    "sbId" TEXT,
    "siteAddress" TEXT,
    "customerId" INTEGER,
    "projectManagerId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "prevWage" BOOLEAN NOT NULL DEFAULT false,
    "driveTime" BOOLEAN NOT NULL DEFAULT false,
    "driveTimeTypeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriveTime" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriveTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNum_key" ON "Job"("jobNum");

-- CreateIndex
CREATE UNIQUE INDEX "Job_sbId_key" ON "Job"("sbId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_name_key" ON "Customer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DriveTime_name_key" ON "DriveTime"("name");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_driveTimeTypeId_fkey" FOREIGN KEY ("driveTimeTypeId") REFERENCES "DriveTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
