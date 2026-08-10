import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DonacionesService } from './donaciones.service';
import { ActualizarDonacionesDto } from './dto/donaciones.dto';

@Controller('donaciones')
export class DonacionesController {
  constructor(private readonly donacionesService: DonacionesService) {}

  /** Configuración pública de donaciones para el sitio. */
  @Get('publica')
  obtenerPublica() {
    return this.donacionesService.obtener();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  obtener() {
    return this.donacionesService.obtener();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  actualizar(@Body() dto: ActualizarDonacionesDto) {
    return this.donacionesService.actualizar(dto);
  }
}
