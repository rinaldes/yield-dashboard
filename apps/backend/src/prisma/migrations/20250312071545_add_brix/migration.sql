-- CreateEnum
CREATE TYPE "BrixSource" AS ENUM ('market', 'reject', 'none');

-- CreateEnum
CREATE TYPE "BrixType" AS ENUM ('tip', 'deep', 'all');

-- CreateTable
CREATE TABLE "Brix" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "from" "BrixSource" NOT NULL DEFAULT 'none',
    "type" "BrixType",
    "brix_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Brix_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Brix" ADD CONSTRAINT "Brix_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
