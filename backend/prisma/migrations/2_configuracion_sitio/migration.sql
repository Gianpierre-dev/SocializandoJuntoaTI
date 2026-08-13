-- CreateTable
CREATE TABLE "configuracion_sitio" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nombre" TEXT NOT NULL,
    "eslogan" TEXT NOT NULL,
    "fechaFundacion" TEXT NOT NULL,
    "publicoObjetivo" TEXT NOT NULL,
    "mision" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "facebookUrl" TEXT,
    "linktreeUrl" TEXT,
    "whatsappUrl" TEXT,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_sitio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "sedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plataformas_online" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "plataformas_online_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisitos_voluntariado" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "requisitos_voluntariado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficios_voluntariado" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "beneficios_voluntariado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas_trabajo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "areas_trabajo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sedes" ADD CONSTRAINT "sedes_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plataformas_online" ADD CONSTRAINT "plataformas_online_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisitos_voluntariado" ADD CONSTRAINT "requisitos_voluntariado_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficios_voluntariado" ADD CONSTRAINT "beneficios_voluntariado_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_trabajo" ADD CONSTRAINT "areas_trabajo_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
