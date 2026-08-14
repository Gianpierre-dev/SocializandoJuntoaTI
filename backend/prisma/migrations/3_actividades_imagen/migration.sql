-- AlterTable
ALTER TABLE "actividades" ADD COLUMN "duracion" TEXT;
ALTER TABLE "actividades" ADD COLUMN "frecuencia" TEXT;
ALTER TABLE "actividades" ADD COLUMN "imagenUrl" TEXT;
ALTER TABLE "actividades" ADD COLUMN "textoAlternativo" TEXT;

-- CreateTable
CREATE TABLE "beneficios_participante" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "beneficios_participante_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beneficios_participante" ADD CONSTRAINT "beneficios_participante_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "configuracion_sitio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
