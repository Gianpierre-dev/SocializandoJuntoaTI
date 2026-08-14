import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarCifraDto, CrearCifraDto } from './dto/cifra.dto';

@Injectable()
export class CifrasService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.cifraImpacto.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const cifra = await this.prisma.cifraImpacto.findUnique({ where: { id } });
    if (!cifra) throw new NotFoundException('Cifra no encontrada');
    return cifra;
  }

  crear(dto: CrearCifraDto) {
    return this.prisma.cifraImpacto.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarCifraDto) {
    await this.obtener(id);
    return this.prisma.cifraImpacto.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.cifraImpacto.delete({ where: { id } });
  }
}
