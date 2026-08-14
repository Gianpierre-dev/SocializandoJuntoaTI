import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearCifraDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20, { message: 'El valor debe ser corto (ej.: 200, +500, 3)' })
  valor!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(60)
  etiqueta!: string;

  @IsInt()
  orden!: number;
}

export class ActualizarCifraDto extends PartialType(CrearCifraDto) {}
