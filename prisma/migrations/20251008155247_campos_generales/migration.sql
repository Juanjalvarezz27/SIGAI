/*
  Warnings:

  - You are about to drop the column `area` on the `Direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipoEstado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Equipo" DROP CONSTRAINT "Equipo_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipo" DROP CONSTRAINT "Equipo_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipo" DROP CONSTRAINT "Equipo_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEquipo" DROP CONSTRAINT "TicketEquipo_equipoId_fkey";

-- AlterTable
ALTER TABLE "public"."Direcciones" DROP COLUMN "area";

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "fecha_creacion",
ADD COLUMN     "areaId" INTEGER,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "cedula" DROP NOT NULL,
ALTER COLUMN "apellido" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Equipo";

-- DropTable
DROP TABLE "public"."EquipoEstado";

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoEquipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipos" (
    "id" SERIAL NOT NULL,
    "bienNacional" TEXT,
    "serial" TEXT,
    "observaciones" TEXT,
    "tipoEquipoId" INTEGER NOT NULL,
    "modeloId" INTEGER NOT NULL,
    "statusId" INTEGER,
    "estadoId" INTEGER,
    "usuarioId" INTEGER,
    "especificacionesId" INTEGER,

    CONSTRAINT "Equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EspecificacionesAdicionales" (
    "id" SERIAL NOT NULL,
    "memoriaRam" TEXT,
    "modulosRam" TEXT,
    "capacidadDisco" TEXT,
    "tipoDisco" TEXT,
    "procesador" TEXT,

    CONSTRAINT "EspecificacionesAdicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Marca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Modelo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marcaId" INTEGER NOT NULL,

    CONSTRAINT "Modelo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estados" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Estados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoEquipo_nombre_key" ON "public"."TipoEquipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nombre_key" ON "public"."Marca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Modelo_nombre_key" ON "public"."Modelo"("nombre");

-- AddForeignKey
ALTER TABLE "public"."Area" ADD CONSTRAINT "Area_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."Direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEquipo" ADD CONSTRAINT "TicketEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "public"."Equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_tipoEquipoId_fkey" FOREIGN KEY ("tipoEquipoId") REFERENCES "public"."TipoEquipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "public"."Modelo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipos" ADD CONSTRAINT "Equipos_especificacionesId_fkey" FOREIGN KEY ("especificacionesId") REFERENCES "public"."EspecificacionesAdicionales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Modelo" ADD CONSTRAINT "Modelo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
