import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarBannerDto, CrearBannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  listarPublicos() {
    return this.prisma.banner.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });
  }

  listarTodos() {
    return this.prisma.banner.findMany({ orderBy: { orden: 'asc' } });
  }

  async obtener(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner no encontrado');
    return banner;
  }

  crear(dto: CrearBannerDto) {
    return this.prisma.banner.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarBannerDto) {
    await this.obtener(id);
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    return this.prisma.banner.delete({ where: { id } });
  }
}
