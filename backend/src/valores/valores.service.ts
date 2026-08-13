import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarValorDto, CrearValorDto } from './dto/valor.dto';

@Injectable()
export class ValoresService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.valor.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const valor = await this.prisma.valor.findUnique({ where: { id } });
    if (!valor) throw new NotFoundException('Valor no encontrado');
    return valor;
  }

  crear(dto: CrearValorDto) {
    return this.prisma.valor.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarValorDto) {
    await this.obtener(id);
    return this.prisma.valor.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.valor.delete({ where: { id } });
  }
}
