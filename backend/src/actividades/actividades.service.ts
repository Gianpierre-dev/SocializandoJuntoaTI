import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarActividadDto, CrearActividadDto } from './dto/actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.actividad.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
    });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');
    return actividad;
  }

  crear(dto: CrearActividadDto) {
    return this.prisma.actividad.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarActividadDto) {
    await this.obtener(id);
    return this.prisma.actividad.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.actividad.delete({ where: { id } });
  }
}
