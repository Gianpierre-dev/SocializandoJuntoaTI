import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsInt, IsString, MaxLength, MinLength } from 'class-validator';
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

  @IsInt()
  orden!: number;
}

export class ActualizarActividadDto extends PartialType(CrearActividadDto) {}
