import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EstadoActividad, Modalidad } from '@prisma/client';

export class CrearActividadDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  titulo!: string;

  @IsString()
  @MaxLength(300)
  resumen!: string;

  @IsString()
  @MaxLength(1000)
  descripcion!: string;

  @IsString()
  @MaxLength(120)
  costo!: string;

  @IsEnum(Modalidad)
  modalidad!: Modalidad;

  @IsEnum(EstadoActividad)
  estado!: EstadoActividad;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  duracion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  frecuencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  textoAlternativo?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarActividadDto extends PartialType(CrearActividadDto) {}
