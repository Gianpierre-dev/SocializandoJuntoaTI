import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VarianteColor } from '@prisma/client';

export class CrearProgramaDto {
  @IsString()
  @MinLength(3)
  @MaxLength(60, { message: 'El título no puede superar 60 caracteres' })
  titulo!: string;

  @IsString()
  @MaxLength(80)
  subtitulo!: string;

  @IsString()
  @Matches(/^(\/|https?:\/\/)/, {
    message: 'El enlace debe empezar con / o https://',
  })
  @MaxLength(300)
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
