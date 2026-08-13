import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsInt, IsString, Matches, Max, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AlmacenamientoService,
  CARPETAS_PERMITIDAS,
} from './almacenamiento.service';

const PESO_MAXIMO_BYTES = 5 * 1024 * 1024;

class SolicitarUrlSubidaDto {
  @IsIn(CARPETAS_PERMITIDAS, { message: 'Carpeta no permitida' })
  carpeta!: (typeof CARPETAS_PERMITIDAS)[number];

  @IsString()
  @Matches(/^\.?[a-zA-Z0-9]{2,5}$/, { message: 'Extensión no válida' })
  extension!: string;

  @IsInt()
  @Min(1, { message: 'El archivo está vacío' })
  @Max(PESO_MAXIMO_BYTES, {
    message: 'La imagen no puede superar los 5 MB',
  })
  peso!: number;
}

@Controller('almacenamiento')
@UseGuards(JwtAuthGuard)
export class AlmacenamientoController {
  constructor(private readonly almacenamiento: AlmacenamientoService) {}

  @Post('url-subida')
  solicitarUrlSubida(@Body() dto: SolicitarUrlSubidaDto) {
    return this.almacenamiento.generarUrlSubida(
      dto.carpeta,
      dto.extension,
      dto.peso,
    );
  }
}
