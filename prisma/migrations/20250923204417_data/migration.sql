/*
  Warnings:

  - The `area` column on the `Direcciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Direcciones" DROP COLUMN "area",
ADD COLUMN     "area" TEXT[];
