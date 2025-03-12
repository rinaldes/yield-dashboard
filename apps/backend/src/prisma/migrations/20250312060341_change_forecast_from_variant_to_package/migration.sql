/*
  Warnings:

  - You are about to drop the column `variant_grade_id` on the `ForecastVariant` table. All the data in the column will be lost.
  - Added the required column `package_id` to the `ForecastVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ForecastVariant" DROP CONSTRAINT "ForecastVariant_variant_grade_id_fkey";

-- AlterTable
ALTER TABLE "ForecastVariant" DROP COLUMN "variant_grade_id",
ADD COLUMN     "package_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ForecastVariant" ADD CONSTRAINT "ForecastVariant_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
