-- CreateTable
CREATE TABLE "postulaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "correo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "mensaje" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postulaciones_pkey" PRIMARY KEY ("id")
);
