-- AlterTable
ALTER TABLE "configuracion_sitio" ADD COLUMN "correo" TEXT;

-- CreateTable
CREATE TABLE "cifras_impacto" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cifras_impacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonios" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "detalle" TEXT,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonios_pkey" PRIMARY KEY ("id")
);
