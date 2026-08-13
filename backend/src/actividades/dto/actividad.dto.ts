import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsInt, IsString, MinLength } from 'class-validator';
import { EstadoActividad, Modalidad } from '@prisma/client';

export class CrearActividadDto {
  @IsString()
  @MinLength(3)
  titulo!: string;

  @IsString()
  resumen!: string;

  @IsString()
  descripcion!: string;

  @IsString()
  costo!: string;

  @IsEnum(Modalidad)
  modalidad!: Modalidad;

  @IsEnum(EstadoActividad)
  estado!: EstadoActividad;

  @IsInt()
  orden!: number;
}

export class ActualizarActividadDto extends PartialType(CrearActividadDto) {}
