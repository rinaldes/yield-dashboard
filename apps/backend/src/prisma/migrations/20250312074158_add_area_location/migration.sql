/*
  Warnings:

  - Added the required column `pic_id` to the `Brix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brix" ADD COLUMN     "pic_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Brix" ADD CONSTRAINT "Brix_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "Pic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
