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

export class CrearProgramaDto {
  @IsString()
  @MinLength(3)
  titulo!: string;

  @IsString()
  subtitulo!: string;

  @IsString()
  enlace!: string;

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

export class ActualizarProgramaDto extends PartialType(CrearProgramaDto) {}
