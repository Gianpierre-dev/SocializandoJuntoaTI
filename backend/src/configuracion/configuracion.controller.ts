import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfiguracionService } from './configuracion.service';
import { ActualizarConfiguracionDto } from './dto/configuracion.dto';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  /** Configuración pública del sitio (datos generales). */
  @Get('publica')
  obtenerPublica() {
    return this.configuracionService.obtener();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  obtener() {
    return this.configuracionService.obtener();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  actualizar(@Body() dto: ActualizarConfiguracionDto) {
    return this.configuracionService.actualizar(dto);
  }
}
