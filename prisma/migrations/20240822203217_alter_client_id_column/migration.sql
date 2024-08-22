-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_clientId_fkey";

-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
