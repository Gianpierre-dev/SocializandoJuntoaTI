import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BannersService } from './banners.service';
import { ActualizarBannerDto, CrearBannerDto } from './dto/banner.dto';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  /** Listado público: solo banners activos, para el sitio. */
  @Get('publicos')
  listarPublicos() {
    return this.bannersService.listarPublicos();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listarTodos() {
    return this.bannersService.listarTodos();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.bannersService.obtener(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearBannerDto) {
    return this.bannersService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarBannerDto,
  ) {
    return this.bannersService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.bannersService.eliminar(id);
  }
}
