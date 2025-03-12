CREATE TABLE "Location" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"is_indoors" BOOLEAN NOT NULL,
	"is_active" BOOLEAN NOT NULL DEFAULT true,
	"description" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "LocationDetail" (
	"id" SERIAL,
	"location_id" INTEGER,
	"total_plants" INTEGER NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Pic" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"is_active" BOOLEAN NOT NULL DEFAULT true,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Harvest" (
	"id" SERIAL,
	"datetime" TIMESTAMP NOT NULL,
	"location_id" INTEGER,
	"pic_id" INTEGER,
	"siklus" INTEGER,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Packing" (
	"id" SERIAL,
	"harvest_id" INTEGER,
	"package_id" INTEGER,
	"quantity" INTEGER NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Fruit" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"is_active" BOOLEAN NOT NULL DEFAULT true,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Variant" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"fruit_id" INTEGER,
	"is_active" BOOLEAN NOT NULL DEFAULT true,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Grade" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "VariantGrade" (
	"id" SERIAL,
	"variant_id" INTEGER,
	"grade_id" INTEGER,
	"is_active" BOOLEAN NOT NULL DEFAULT true,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Package" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"variant_id" INTEGER,
	"description" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Reject" (
	"id" SERIAL,
	"harvest_id" INTEGER,
	"reason_id" INTEGER,
	"quantity" INTEGER NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "RejectReason" (
	"id" SERIAL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "Yield" (
	"id" SERIAL,
	"harvest_id" INTEGER,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


CREATE TABLE "YieldVariant" (
	"id" SERIAL,
	"yield_id" INTEGER,
	"variant_grade_id" INTEGER,
	"quantity" INTEGER NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	PRIMARY KEY("id")
);


ALTER TABLE "LocationDetail"
ADD FOREIGN KEY("location_id") REFERENCES "Location"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Harvest"
ADD FOREIGN KEY("location_id") REFERENCES "Location"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Harvest"
ADD FOREIGN KEY("pic_id") REFERENCES "Pic"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Packing"
ADD FOREIGN KEY("harvest_id") REFERENCES "Harvest"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Variant"
ADD FOREIGN KEY("fruit_id") REFERENCES "Fruit"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "VariantGrade"
ADD FOREIGN KEY("variant_id") REFERENCES "Variant"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "VariantGrade"
ADD FOREIGN KEY("grade_id") REFERENCES "Grade"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Package"
ADD FOREIGN KEY("variant_id") REFERENCES "Variant"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reject"
ADD FOREIGN KEY("harvest_id") REFERENCES "Harvest"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Yield"
ADD FOREIGN KEY("harvest_id") REFERENCES "Harvest"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "YieldVariant"
ADD FOREIGN KEY("yield_id") REFERENCES "Yield"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "YieldVariant"
ADD FOREIGN KEY("variant_grade_id") REFERENCES "VariantGrade"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reject"
ADD FOREIGN KEY("reason_id") REFERENCES "RejectReason"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Packing"
ADD FOREIGN KEY("package_id") REFERENCES "Package"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;