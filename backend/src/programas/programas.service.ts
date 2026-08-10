import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarProgramaDto, CrearProgramaDto } from './dto/programa.dto';

@Injectable()
export class ProgramasService {
  constructor(private readonly prisma: PrismaService) {}

  listarPublicos() {
    return this.prisma.programa.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });
  }

  listarTodos() {
    return this.prisma.programa.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const programa = await this.prisma.programa.findUnique({ where: { id } });
    if (!programa) throw new NotFoundException('Programa no encontrado');
    return programa;
  }

  crear(dto: CrearProgramaDto) {
    return this.prisma.programa.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarProgramaDto) {
    await this.obtener(id);
    return this.prisma.programa.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.programa.delete({ where: { id } });
  }
}
