import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CorreoService } from '../correo/correo.service';
import { CrearPostulacionDto } from './dto/postulacion.dto';

@Injectable()
export class PostulacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly correo: CorreoService,
  ) {}

  async crear(dto: CrearPostulacionDto) {
    const postulacion = await this.prisma.postulacion.create({ data: dto });
    // La notificación no bloquea la respuesta al postulante.
    void this.correo.notificarPostulacion(postulacion);
    return postulacion;
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
