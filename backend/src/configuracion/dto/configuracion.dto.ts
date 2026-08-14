import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ElementoOrdenadoDto {
  @IsString()
  @MinLength(1)
  texto!: string;

  @IsInt()
  orden!: number;
}

class AreaTrabajoDto {
  @IsString()
  @MinLength(2)
  titulo!: string;

  @IsString()
  descripcion!: string;

  @IsInt()
  orden!: number;
}

export class ActualizarConfiguracionDto {
  @IsString()
  @MinLength(3)
  nombre!: string;

  @IsString()
  eslogan!: string;

  @IsString()
  fechaFundacion!: string;

  @IsString()
  publicoObjetivo!: string;

  @IsString()
  mision!: string;

  @IsString()
  vision!: string;

  @IsString()
  objetivo!: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  tiktokUrl?: string;

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  linktreeUrl?: string;

  @IsOptional()
  @IsString()
  whatsappUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementoOrdenadoDto)
  sedes!: ElementoOrdenadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementoOrdenadoDto)
  plataformas!: ElementoOrdenadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementoOrdenadoDto)
  requisitos!: ElementoOrdenadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementoOrdenadoDto)
  beneficios!: ElementoOrdenadoDto[];

  /** Beneficios para quienes participan de las actividades (no voluntarios). */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementoOrdenadoDto)
  beneficiosParticipante!: ElementoOrdenadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaTrabajoDto)
  areas!: AreaTrabajoDto[];
}
