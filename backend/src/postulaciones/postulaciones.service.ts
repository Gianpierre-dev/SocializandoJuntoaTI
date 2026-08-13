import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPostulacionDto } from './dto/postulacion.dto';

@Injectable()
export class PostulacionesService {
  constructor(private readonly prisma: PrismaService) {}

  crear(dto: CrearPostulacionDto) {
    return this.prisma.postulacion.create({ data: dto });
  }

  listar() {
    return this.prisma.postulacion.findMany({
      orderBy: { creadoEn: 'desc' },
    });
  }

  async eliminar(id: string) {
    const postulacion = await this.prisma.postulacion.findUnique({
      where: { id },
    });
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');
    return this.prisma.postulacion.delete({ where: { id } });
  }
}
