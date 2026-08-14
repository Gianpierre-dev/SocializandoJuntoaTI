import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearTestimonioDto {
  @IsString()
  @MinLength(10, { message: 'El testimonio es muy corto' })
  @MaxLength(400)
  texto!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  autor!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  detalle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  fotoUrl?: string;

  @IsInt()
  orden!: number;
}

export class ActualizarTestimonioDto extends PartialType(CrearTestimonioDto) {}
