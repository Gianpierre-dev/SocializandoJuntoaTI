import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarAliadoDto, CrearAliadoDto } from './dto/aliado.dto';

@Injectable()
export class AliadosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.aliado.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const aliado = await this.prisma.aliado.findUnique({ where: { id } });
    if (!aliado) throw new NotFoundException('Aliado no encontrado');
    return aliado;
  }

  crear(dto: CrearAliadoDto) {
    return this.prisma.aliado.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarAliadoDto) {
    await this.obtener(id);
    return this.prisma.aliado.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.aliado.delete({ where: { id } });
  }
}
