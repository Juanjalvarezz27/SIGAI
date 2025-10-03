-- CreateTable
CREATE TABLE "public"."UnidadAsignacion" (
    "id" SERIAL NOT NULL,
    "unidadAs" TEXT NOT NULL,

    CONSTRAINT "UnidadAsignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UnidadAdministrativa" (
    "id" SERIAL NOT NULL,
    "unidadAd" TEXT NOT NULL,
    "unidadAsignacionId" INTEGER NOT NULL,

    CONSTRAINT "UnidadAdministrativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "unidadAdministrativaId" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rol" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "bienNacional" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "unidadAsignacionId" INTEGER NOT NULL,
    "unidadAdministrativaId" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EquipoEstado" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "EquipoEstado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "usuarioCreadorId" INTEGER NOT NULL,
    "usuarioCerradorId" INTEGER,
    "estadoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketEstado" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "TicketEstado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketEvento" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "analistaId" INTEGER NOT NULL,

    CONSTRAINT "TicketEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketEquipo" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "analistaId" INTEGER NOT NULL,

    CONSTRAINT "TicketEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TicketEvento_ticketId_key" ON "public"."TicketEvento"("ticketId");

-- AddForeignKey
ALTER TABLE "public"."UnidadAdministrativa" ADD CONSTRAINT "UnidadAdministrativa_unidadAsignacionId_fkey" FOREIGN KEY ("unidadAsignacionId") REFERENCES "public"."UnidadAsignacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_unidadAdministrativaId_fkey" FOREIGN KEY ("unidadAdministrativaId") REFERENCES "public"."UnidadAdministrativa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."EquipoEstado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_unidadAsignacionId_fkey" FOREIGN KEY ("unidadAsignacionId") REFERENCES "public"."UnidadAsignacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_unidadAdministrativaId_fkey" FOREIGN KEY ("unidadAdministrativaId") REFERENCES "public"."UnidadAdministrativa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."TicketEstado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_usuarioCreadorId_fkey" FOREIGN KEY ("usuarioCreadorId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_usuarioCerradorId_fkey" FOREIGN KEY ("usuarioCerradorId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEvento" ADD CONSTRAINT "TicketEvento_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEvento" ADD CONSTRAINT "TicketEvento_analistaId_fkey" FOREIGN KEY ("analistaId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEquipo" ADD CONSTRAINT "TicketEquipo_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEquipo" ADD CONSTRAINT "TicketEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "public"."Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketEquipo" ADD CONSTRAINT "TicketEquipo_analistaId_fkey" FOREIGN KEY ("analistaId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
