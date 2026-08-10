import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarDonacionesDto } from './dto/donaciones.dto';

const ID_CONFIGURACION = 1;

@Injectable()
export class DonacionesService {
  constructor(private readonly prisma: PrismaService) {}

  obtener() {
    return this.prisma.configuracionDonaciones.findUnique({
      where: { id: ID_CONFIGURACION },
      include: {
        cuentas: { orderBy: { orden: 'asc' } },
        impactos: { orderBy: { orden: 'asc' } },
      },
    });
  }

  /**
   * Reemplaza la configuración completa en una transacción:
   * la edición del panel siempre envía el estado íntegro.
   */
  actualizar(dto: ActualizarDonacionesDto) {
    const { cuentas, impactos, ...datos } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.configuracionDonaciones.upsert({
        where: { id: ID_CONFIGURACION },
        create: { id: ID_CONFIGURACION, ...datos },
        update: datos,
      });

      await tx.cuentaBancaria.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });
      await tx.ejemploImpacto.deleteMany({
        where: { configuracionId: ID_CONFIGURACION },
      });

      if (cuentas.length > 0) {
        await tx.cuentaBancaria.createMany({
          data: cuentas.map((cuenta) => ({
            ...cuenta,
            configuracionId: ID_CONFIGURACION,
          })),
        });
      }
      if (impactos.length > 0) {
        await tx.ejemploImpacto.createMany({
          data: impactos.map((impacto) => ({
            ...impacto,
            configuracionId: ID_CONFIGURACION,
          })),
        });
      }

      return tx.configuracionDonaciones.findUnique({
        where: { id: ID_CONFIGURACION },
        include: {
          cuentas: { orderBy: { orden: 'asc' } },
          impactos: { orderBy: { orden: 'asc' } },
        },
      });
    });
  }
}
