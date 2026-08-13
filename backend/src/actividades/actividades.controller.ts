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
import { ActividadesService } from './actividades.service';
import { ActualizarActividadDto, CrearActividadDto } from './dto/actividad.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  /** Listado público para el sitio. */
  @Get('publicas')
  listarPublicas() {
    return this.actividadesService.listar();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.actividadesService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearActividadDto) {
    return this.actividadesService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarActividadDto,
  ) {
    return this.actividadesService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.actividadesService.eliminar(id);
  }
}
