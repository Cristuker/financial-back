/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contract_clientId_key" ON "Contract"("clientId");
