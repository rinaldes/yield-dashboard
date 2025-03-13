/*
  Warnings:

  - You are about to drop the `YieldVariant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `Yield` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_grade_id` to the `Yield` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "YieldVariant" DROP CONSTRAINT "YieldVariant_variant_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "YieldVariant" DROP CONSTRAINT "YieldVariant_yield_id_fkey";

-- AlterTable
ALTER TABLE "Yield" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "variant_grade_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "YieldVariant";

-- AddForeignKey
ALTER TABLE "Yield" ADD CONSTRAINT "Yield_variant_grade_id_fkey" FOREIGN KEY ("variant_grade_id") REFERENCES "VariantGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
