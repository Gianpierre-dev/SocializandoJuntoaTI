import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarConfiguracionDto } from './dto/configuracion.dto';

const ID_CONFIGURACION = 1;

const INCLUIR_RELACIONES = {
  sedes: { orderBy: { orden: 'asc' as const } },
  plataformas: { orderBy: { orden: 'asc' as const } },
  requisitos: { orderBy: { orden: 'asc' as const } },
  beneficios: { orderBy: { orden: 'asc' as const } },
  beneficiosParticipante: { orderBy: { orden: 'asc' as const } },
  areas: { orderBy: { orden: 'asc' as const } },
};

@Injectable()
export class ConfiguracionService {
  constructor(private readonly prisma: PrismaService) {}

  obtener() {
    return this.prisma.configuracionSitio.findUnique({
      where: { id: ID_CONFIGURACION },
      include: INCLUIR_RELACIONES,
    });
  }

  /**
   * Reemplaza la configuración completa en una transacción: el panel
   * siempre envía el estado íntegro.
   */
  actualizar(dto: ActualizarConfiguracionDto) {
    const {
      sedes,
      plataformas,
      requisitos,
      beneficios,
      beneficiosParticipante,
      areas,
      ...datos
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.configuracionSitio.upsert({
        where: { id: ID_CONFIGURACION },
        create: { id: ID_CONFIGURACION, ...datos },
        update: datos,
      });

      await tx.sede.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.plataformaOnline.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.requisitoVoluntariado.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.beneficioVoluntariado.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.beneficioParticipante.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.areaTrabajo.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });

      const conConfiguracion = <T>(fila: T) => ({
        ...fila,
        configuracionId: ID_CONFIGURACION,
      });

      if (sedes.length > 0) {
        await tx.sede.createMany({
          data: sedes.map((s) =>
            conConfiguracion({ nombre: s.texto, orden: s.orden }),
          ),
        });
      }
      if (plataformas.length > 0) {
        await tx.plataformaOnline.createMany({
          data: plataformas.map((p) =>
            conConfiguracion({ nombre: p.texto, orden: p.orden }),
          ),
        });
      }
      if (requisitos.length > 0) {
        await tx.requisitoVoluntariado.createMany({
          data: requisitos.map((r) => conConfiguracion(r)),
        });
      }
      if (beneficios.length > 0) {
        await tx.beneficioVoluntariado.createMany({
          data: beneficios.map((b) => conConfiguracion(b)),
        });
      }
      if (beneficiosParticipante.length > 0) {
        await tx.beneficioParticipante.createMany({
          data: beneficiosParticipante.map((b) => conConfiguracion(b)),
        });
      }
      if (areas.length > 0) {
        await tx.areaTrabajo.createMany({
          data: areas.map((a) => conConfiguracion(a)),
        });
      }

      return tx.configuracionSitio.findUnique({
        where: { id: ID_CONFIGURACION },
        include: INCLUIR_RELACIONES,
      });
    });
  }
}
