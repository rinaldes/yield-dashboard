-- CreateTable
CREATE TABLE "Forecast" (
    "id" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "location_id" INTEGER NOT NULL,
    "pic_id" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "total_ex_momoka" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Forecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastVariant" (
    "id" SERIAL NOT NULL,
    "forecast_id" TEXT NOT NULL,
    "variant_grade_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForecastVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "Pic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastVariant" ADD CONSTRAINT "ForecastVariant_forecast_id_fkey" FOREIGN KEY ("forecast_id") REFERENCES "Forecast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastVariant" ADD CONSTRAINT "ForecastVariant_variant_grade_id_fkey" FOREIGN KEY ("variant_grade_id") REFERENCES "VariantGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
