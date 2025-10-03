/*
  Warnings:

  - You are about to drop the column `unidadAdministrativaId` on the `Equipo` table. All the data in the column will be lost.
  - You are about to drop the column `unidadAsignacionId` on the `Equipo` table. All the data in the column will be lost.
  - You are about to drop the column `unidadAdministrativaId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `UnidadAdministrativa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnidadAsignacion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `direccionId` to the `Equipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccionId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Equipo" DROP CONSTRAINT "Equipo_unidadAdministrativaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipo" DROP CONSTRAINT "Equipo_unidadAsignacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UnidadAdministrativa" DROP CONSTRAINT "UnidadAdministrativa_unidadAsignacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_unidadAdministrativaId_fkey";

-- AlterTable
ALTER TABLE "public"."Equipo" DROP COLUMN "unidadAdministrativaId",
DROP COLUMN "unidadAsignacionId",
ADD COLUMN     "direccionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "unidadAdministrativaId",
ADD COLUMN     "direccionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."UnidadAdministrativa";

-- DropTable
DROP TABLE "public"."UnidadAsignacion";

-- CreateTable
CREATE TABLE "public"."Direcciones" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "pisoId" INTEGER NOT NULL,

    CONSTRAINT "Direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Piso" (
    "id" SERIAL NOT NULL,
    "piso" TEXT NOT NULL,

    CONSTRAINT "Piso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Direcciones" ADD CONSTRAINT "Direcciones_pisoId_fkey" FOREIGN KEY ("pisoId") REFERENCES "public"."Piso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."Direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."Direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
