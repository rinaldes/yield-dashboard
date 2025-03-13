/*
  Warnings:

  - Added the required column `total` to the `Harvest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_ex_momoka` to the `Harvest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Harvest" ADD COLUMN     "total" INTEGER NOT NULL,
ADD COLUMN     "total_ex_momoka" INTEGER NOT NULL;
