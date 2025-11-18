/*
  Warnings:

  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Direcciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EspecificacionesAdicionales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modelo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Piso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketEquipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketEstado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketEvento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoEquipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Area" DROP CONSTRAINT "Area_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Direcciones" DROP CONSTRAINT "Direcciones_pisoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_especificacionesId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_modeloId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_statusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_tipoEquipoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipos" DROP CONSTRAINT "Equipos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Modelo" DROP CONSTRAINT "Modelo_marcaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_usuarioCerradorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_usuarioCreadorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEquipo" DROP CONSTRAINT "TicketEquipo_analistaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEquipo" DROP CONSTRAINT "TicketEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEquipo" DROP CONSTRAINT "TicketEquipo_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEvento" DROP CONSTRAINT "TicketEvento_analistaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEvento" DROP CONSTRAINT "TicketEvento_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_areaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- DropTable
DROP TABLE "public"."Area";

-- DropTable
DROP TABLE "public"."Direcciones";

-- DropTable
DROP TABLE "public"."Equipos";

-- DropTable
DROP TABLE "public"."EspecificacionesAdicionales";

-- DropTable
DROP TABLE "public"."Estados";

-- DropTable
DROP TABLE "public"."Marca";

-- DropTable
DROP TABLE "public"."Modelo";

-- DropTable
DROP TABLE "public"."Piso";

-- DropTable
DROP TABLE "public"."Rol";

-- DropTable
DROP TABLE "public"."Status";

-- DropTable
DROP TABLE "public"."Ticket";

-- DropTable
DROP TABLE "public"."TicketEquipo";

-- DropTable
DROP TABLE "public"."TicketEstado";

-- DropTable
DROP TABLE "public"."TicketEvento";

-- DropTable
DROP TABLE "public"."TipoEquipo";

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "public"."direcciones" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "pisoId" INTEGER NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."areas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pisos" (
    "id" SERIAL NOT NULL,
    "piso" TEXT NOT NULL,

    CONSTRAINT "pisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "email" TEXT,
    "rolId" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,
    "areaId" INTEGER,
    "password" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "tipoAnalistaId" INTEGER,
    "supervisorTipoId" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipo_analista" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "tipo_analista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supervisor_tipo" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "supervisor_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_reasignacion" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "analistaAnteriorId" INTEGER NOT NULL,
    "analistaNuevoId" INTEGER NOT NULL,
    "supervisorId" INTEGER NOT NULL,
    "motivo" TEXT,
    "fechaReasignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_reasignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deshabilitacion_historial" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "fechaDeshabilitacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deshabilitadoPorId" INTEGER NOT NULL,

    CONSTRAINT "deshabilitacion_historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "usuarioCreadorId" INTEGER NOT NULL,
    "usuarioCerradorId" INTEGER,
    "usuarioAfectadoId" INTEGER,
    "estadoId" INTEGER NOT NULL,
    "tipoTicketId" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipo_ticket" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "tipo_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_estado" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "ticket_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_cierre" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "usuarioCerradorId" INTEGER NOT NULL,
    "fechaCierre" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condicion" TEXT NOT NULL,
    "memoFinalizacion" TEXT,
    "observaciones" TEXT,
    "tiempoEjecucionMinutos" INTEGER,

    CONSTRAINT "ticket_cierre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_evento" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "analistaId" INTEGER NOT NULL,

    CONSTRAINT "ticket_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_equipo" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "analistaId" INTEGER NOT NULL,

    CONSTRAINT "ticket_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipo_equipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "tipo_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."equipos" (
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

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deshabilitacion_historial_equipos" (
    "id" SERIAL NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "fechaDeshabilitacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deshabilitadoPorId" INTEGER NOT NULL,
    "statusAnteriorId" INTEGER NOT NULL,
    "statusNuevoId" INTEGER NOT NULL,
    "estadoNuevoId" INTEGER,
    "estadoAnteriorId" INTEGER,

    CONSTRAINT "deshabilitacion_historial_equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."especificaciones_adicionales" (
    "id" SERIAL NOT NULL,
    "memoriaRam" TEXT,
    "modulosRam" TEXT,
    "capacidadDisco" TEXT,
    "tipoDisco" TEXT,
    "procesador" TEXT,

    CONSTRAINT "especificaciones_adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marcas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."modelos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marcaId" INTEGER NOT NULL,

    CONSTRAINT "modelos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estados" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sistemas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',

    CONSTRAINT "sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fallas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "fallas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_sistemas" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "sistemaId" INTEGER NOT NULL,
    "fallaId" INTEGER NOT NULL,
    "usuarioAfectadoId" INTEGER NOT NULL,

    CONSTRAINT "ticket_sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reasignacion_historial_equipos" (
    "id" SERIAL NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "usuarioAnteriorId" INTEGER,
    "usuarioNuevoId" INTEGER,
    "motivo" TEXT,
    "reasignadoPorId" INTEGER NOT NULL,
    "fechaReasignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reasignacion_historial_equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."eventos_externos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicial" TIMESTAMP(3) NOT NULL,
    "fechaFinal" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'En proceso',
    "usuarioSolicitanteId" INTEGER NOT NULL,
    "usuarioAsignadoId" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,
    "pisoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_externos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."equipos_evento" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "tipoEquipoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "equipos_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evento_externo_estado" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "motivo" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_externo_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_cierre_ticketId_key" ON "public"."ticket_cierre"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_evento_ticketId_key" ON "public"."ticket_evento"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_equipo_nombre_key" ON "public"."tipo_equipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_key" ON "public"."marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "modelos_nombre_key" ON "public"."modelos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "sistemas_nombre_key" ON "public"."sistemas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "fallas_nombre_key" ON "public"."fallas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_sistemas_ticketId_key" ON "public"."ticket_sistemas"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "evento_externo_estado_eventoId_key" ON "public"."evento_externo_estado"("eventoId");

-- AddForeignKey
ALTER TABLE "public"."direcciones" ADD CONSTRAINT "direcciones_pisoId_fkey" FOREIGN KEY ("pisoId") REFERENCES "public"."pisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_tipoAnalistaId_fkey" FOREIGN KEY ("tipoAnalistaId") REFERENCES "public"."tipo_analista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_supervisorTipoId_fkey" FOREIGN KEY ("supervisorTipoId") REFERENCES "public"."supervisor_tipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_reasignacion" ADD CONSTRAINT "ticket_reasignacion_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_reasignacion" ADD CONSTRAINT "ticket_reasignacion_analistaAnteriorId_fkey" FOREIGN KEY ("analistaAnteriorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_reasignacion" ADD CONSTRAINT "ticket_reasignacion_analistaNuevoId_fkey" FOREIGN KEY ("analistaNuevoId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_reasignacion" ADD CONSTRAINT "ticket_reasignacion_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial" ADD CONSTRAINT "deshabilitacion_historial_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial" ADD CONSTRAINT "deshabilitacion_historial_deshabilitadoPorId_fkey" FOREIGN KEY ("deshabilitadoPorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."ticket_estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_tipoTicketId_fkey" FOREIGN KEY ("tipoTicketId") REFERENCES "public"."tipo_ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_usuarioCerradorId_fkey" FOREIGN KEY ("usuarioCerradorId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_usuarioCreadorId_fkey" FOREIGN KEY ("usuarioCreadorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_usuarioAfectadoId_fkey" FOREIGN KEY ("usuarioAfectadoId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_cierre" ADD CONSTRAINT "ticket_cierre_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_cierre" ADD CONSTRAINT "ticket_cierre_usuarioCerradorId_fkey" FOREIGN KEY ("usuarioCerradorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_evento" ADD CONSTRAINT "ticket_evento_analistaId_fkey" FOREIGN KEY ("analistaId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_evento" ADD CONSTRAINT "ticket_evento_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_equipo" ADD CONSTRAINT "ticket_equipo_analistaId_fkey" FOREIGN KEY ("analistaId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_equipo" ADD CONSTRAINT "ticket_equipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "public"."equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_equipo" ADD CONSTRAINT "ticket_equipo_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_especificacionesId_fkey" FOREIGN KEY ("especificacionesId") REFERENCES "public"."especificaciones_adicionales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "public"."modelos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_tipoEquipoId_fkey" FOREIGN KEY ("tipoEquipoId") REFERENCES "public"."tipo_equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "public"."equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_deshabilitadoPorId_fkey" FOREIGN KEY ("deshabilitadoPorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_statusAnteriorId_fkey" FOREIGN KEY ("statusAnteriorId") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_statusNuevoId_fkey" FOREIGN KEY ("statusNuevoId") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_estadoAnteriorId_fkey" FOREIGN KEY ("estadoAnteriorId") REFERENCES "public"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deshabilitacion_historial_equipos" ADD CONSTRAINT "deshabilitacion_historial_equipos_estadoNuevoId_fkey" FOREIGN KEY ("estadoNuevoId") REFERENCES "public"."estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modelos" ADD CONSTRAINT "modelos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_sistemas" ADD CONSTRAINT "ticket_sistemas_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_sistemas" ADD CONSTRAINT "ticket_sistemas_sistemaId_fkey" FOREIGN KEY ("sistemaId") REFERENCES "public"."sistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_sistemas" ADD CONSTRAINT "ticket_sistemas_fallaId_fkey" FOREIGN KEY ("fallaId") REFERENCES "public"."fallas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_sistemas" ADD CONSTRAINT "ticket_sistemas_usuarioAfectadoId_fkey" FOREIGN KEY ("usuarioAfectadoId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reasignacion_historial_equipos" ADD CONSTRAINT "reasignacion_historial_equipos_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "public"."equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reasignacion_historial_equipos" ADD CONSTRAINT "reasignacion_historial_equipos_usuarioAnteriorId_fkey" FOREIGN KEY ("usuarioAnteriorId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reasignacion_historial_equipos" ADD CONSTRAINT "reasignacion_historial_equipos_usuarioNuevoId_fkey" FOREIGN KEY ("usuarioNuevoId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reasignacion_historial_equipos" ADD CONSTRAINT "reasignacion_historial_equipos_reasignadoPorId_fkey" FOREIGN KEY ("reasignadoPorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos_externos" ADD CONSTRAINT "eventos_externos_usuarioSolicitanteId_fkey" FOREIGN KEY ("usuarioSolicitanteId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos_externos" ADD CONSTRAINT "eventos_externos_usuarioAsignadoId_fkey" FOREIGN KEY ("usuarioAsignadoId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos_externos" ADD CONSTRAINT "eventos_externos_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "public"."direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos_externos" ADD CONSTRAINT "eventos_externos_pisoId_fkey" FOREIGN KEY ("pisoId") REFERENCES "public"."pisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos_evento" ADD CONSTRAINT "equipos_evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos_externos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos_evento" ADD CONSTRAINT "equipos_evento_tipoEquipoId_fkey" FOREIGN KEY ("tipoEquipoId") REFERENCES "public"."tipo_equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evento_externo_estado" ADD CONSTRAINT "evento_externo_estado_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos_externos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evento_externo_estado" ADD CONSTRAINT "evento_externo_estado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
