import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { VarianteColor } from '@prisma/client';

export class CrearBannerDto {
  @IsString()
  @MinLength(3)
  titulo!: string;

  @IsString()
  etiqueta!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  enlace!: string;

  @IsOptional()
  @IsString()
  textoBoton?: string;

  @IsEnum(VarianteColor)
  variante!: VarianteColor;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  textoAlternativo?: string;

  @IsInt()
  orden!: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class ActualizarBannerDto extends PartialType(CrearBannerDto) {}
