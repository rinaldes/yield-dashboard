/*
  Warnings:

  - Made the column `location_id` on table `Harvest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pic_id` on table `Harvest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variant_id` on table `Package` required. This step will fail if there are existing NULL values in that column.
  - Made the column `harvest_id` on table `Packing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `package_id` on table `Packing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `harvest_id` on table `Reject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason_id` on table `Reject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fruit_id` on table `Variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variant_id` on table `VariantGrade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grade_id` on table `VariantGrade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `harvest_id` on table `Yield` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yield_id` on table `YieldVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variant_grade_id` on table `YieldVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Harvest" DROP CONSTRAINT "Harvest_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Harvest" DROP CONSTRAINT "Harvest_pic_id_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Packing" DROP CONSTRAINT "Packing_harvest_id_fkey";

-- DropForeignKey
ALTER TABLE "Packing" DROP CONSTRAINT "Packing_package_id_fkey";

-- DropForeignKey
ALTER TABLE "Reject" DROP CONSTRAINT "Reject_harvest_id_fkey";

-- DropForeignKey
ALTER TABLE "Reject" DROP CONSTRAINT "Reject_reason_id_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_fruit_id_fkey";

-- DropForeignKey
ALTER TABLE "VariantGrade" DROP CONSTRAINT "VariantGrade_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "VariantGrade" DROP CONSTRAINT "VariantGrade_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Yield" DROP CONSTRAINT "Yield_harvest_id_fkey";

-- DropForeignKey
ALTER TABLE "YieldVariant" DROP CONSTRAINT "YieldVariant_variant_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "YieldVariant" DROP CONSTRAINT "YieldVariant_yield_id_fkey";

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Harvest" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "location_id" SET NOT NULL,
ALTER COLUMN "pic_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "variant_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Packing" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "harvest_id" SET NOT NULL,
ALTER COLUMN "package_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reject" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "harvest_id" SET NOT NULL,
ALTER COLUMN "reason_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "RejectReason" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "fruit_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "VariantGrade" ALTER COLUMN "variant_id" SET NOT NULL,
ALTER COLUMN "grade_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Yield" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "harvest_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "YieldVariant" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "yield_id" SET NOT NULL,
ALTER COLUMN "variant_grade_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "Pic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packing" ADD CONSTRAINT "Packing_harvest_id_fkey" FOREIGN KEY ("harvest_id") REFERENCES "Harvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packing" ADD CONSTRAINT "Packing_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_fruit_id_fkey" FOREIGN KEY ("fruit_id") REFERENCES "Fruit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantGrade" ADD CONSTRAINT "VariantGrade_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantGrade" ADD CONSTRAINT "VariantGrade_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reject" ADD CONSTRAINT "Reject_harvest_id_fkey" FOREIGN KEY ("harvest_id") REFERENCES "Harvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reject" ADD CONSTRAINT "Reject_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "RejectReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yield" ADD CONSTRAINT "Yield_harvest_id_fkey" FOREIGN KEY ("harvest_id") REFERENCES "Harvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldVariant" ADD CONSTRAINT "YieldVariant_yield_id_fkey" FOREIGN KEY ("yield_id") REFERENCES "Yield"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldVariant" ADD CONSTRAINT "YieldVariant_variant_grade_id_fkey" FOREIGN KEY ("variant_grade_id") REFERENCES "VariantGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
