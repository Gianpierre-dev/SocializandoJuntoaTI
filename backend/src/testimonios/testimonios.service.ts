import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActualizarTestimonioDto,
  CrearTestimonioDto,
} from './dto/testimonio.dto';

@Injectable()
export class TestimoniosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.testimonio.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const testimonio = await this.prisma.testimonio.findUnique({
      where: { id },
    });
    if (!testimonio) throw new NotFoundException('Testimonio no encontrado');
    return testimonio;
  }

  crear(dto: CrearTestimonioDto) {
    return this.prisma.testimonio.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarTestimonioDto) {
    await this.obtener(id);
    return this.prisma.testimonio.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.testimonio.delete({ where: { id } });
  }
}
