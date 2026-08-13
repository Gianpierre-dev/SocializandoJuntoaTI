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

export class CrearBannerDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120, { message: 'El título no puede superar 120 caracteres' })
  titulo!: string;

  @IsString()
  @MaxLength(80)
  etiqueta!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'La descripción no puede superar 300 caracteres' })
  descripcion?: string;

  @IsString()
  @Matches(/^(\/|https?:\/\/)/, {
    message: 'El enlace debe empezar con / o https://',
  })
  @MaxLength(300)
  enlace!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
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
