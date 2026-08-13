import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarMiembroDto, CrearMiembroDto } from './dto/miembro.dto';

@Injectable()
export class EquipoService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.miembroEquipo.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const miembro = await this.prisma.miembroEquipo.findUnique({
      where: { id },
    });
    if (!miembro) throw new NotFoundException('Miembro no encontrado');
    return miembro;
  }

  crear(dto: CrearMiembroDto) {
    return this.prisma.miembroEquipo.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarMiembroDto) {
    await this.obtener(id);
    return this.prisma.miembroEquipo.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.miembroEquipo.delete({ where: { id } });
  }
}
