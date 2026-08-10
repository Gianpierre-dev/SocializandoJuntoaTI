import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsString, Matches } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlmacenamientoService } from './almacenamiento.service';

const CARPETAS_PERMITIDAS = [
  'banners',
  'programas',
  'donaciones',
  'equipo',
  'noticias',
] as const;

class SolicitarUrlSubidaDto {
  @IsIn(CARPETAS_PERMITIDAS, { message: 'Carpeta no permitida' })
  carpeta!: (typeof CARPETAS_PERMITIDAS)[number];

  @IsString()
  @Matches(/^\.?[a-zA-Z0-9]{2,5}$/, { message: 'Extensión no válida' })
  extension!: string;
}

@Controller('almacenamiento')
@UseGuards(JwtAuthGuard)
export class AlmacenamientoController {
  constructor(private readonly almacenamiento: AlmacenamientoService) {}

  @Post('url-subida')
  solicitarUrlSubida(@Body() dto: SolicitarUrlSubidaDto) {
    return this.almacenamiento.generarUrlSubida(dto.carpeta, dto.extension);
  }
}
