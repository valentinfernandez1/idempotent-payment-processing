/*
  Warnings:

  - You are about to drop the column `idempotencyKey` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payment_idempotencyKey_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "idempotencyKey",
ADD COLUMN     "statusMessage" TEXT;

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "id" VARCHAR(128) NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_id_key" ON "IdempotencyKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_paymentId_key" ON "IdempotencyKey"("paymentId");

-- AddForeignKey
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
