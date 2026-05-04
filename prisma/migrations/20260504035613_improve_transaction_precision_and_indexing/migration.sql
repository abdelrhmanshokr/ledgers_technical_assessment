/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2),
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_companyId_idx" ON "Transaction"("companyId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
