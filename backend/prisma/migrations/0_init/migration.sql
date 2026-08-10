-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMINISTRADOR', 'EDITOR');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'ONLINE', 'MIXTO');

-- CreateEnum
CREATE TYPE "EstadoActividad" AS ENUM ('ACTIVA', 'EN_DESARROLLO');

-- CreateEnum
CREATE TYPE "VarianteColor" AS ENUM ('BRAND', 'GOLD', 'ROSE', 'GREEN', 'DEEP', 'SUBTLE');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'EDITOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "descripcion" TEXT,
    "enlace" TEXT NOT NULL,
    "textoBoton" TEXT,
    "variante" "VarianteColor" NOT NULL DEFAULT 'BRAND',
    "imagenUrl" TEXT,
    "textoAlternativo" TEXT,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "enlace" TEXT NOT NULL,
    "variante" "VarianteColor" NOT NULL DEFAULT 'BRAND',
    "imagenUrl" TEXT,
    "textoAlternativo" TEXT,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "costo" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "estado" "EstadoActividad" NOT NULL DEFAULT 'ACTIVA',
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miembros_equipo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuarioRedes" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "miembros_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aliados" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuarioRedes" TEXT NOT NULL,
    "enlace" TEXT,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aliados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_donaciones" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "intro" TEXT NOT NULL,
    "yapeNumero" TEXT,
    "yapeQrUrl" TEXT,
    "plinNumero" TEXT,
    "plinQrUrl" TEXT,
    "paypalUrl" TEXT,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_donaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_bancarias" (
    "id" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "titular" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cci" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "cuentas_bancarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejemplos_impacto" (
    "id" TEXT NOT NULL,
    "monto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "ejemplos_impacto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_donaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejemplos_impacto" ADD CONSTRAINT "ejemplos_impacto_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_donaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
