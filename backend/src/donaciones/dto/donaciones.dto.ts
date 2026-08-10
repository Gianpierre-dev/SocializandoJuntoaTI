import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CuentaBancariaDto {
  @IsString()
  banco!: string;

  @IsString()
  titular!: string;

  @IsString()
  numero!: string;

  @IsString()
  cci!: string;

  @IsInt()
  orden!: number;
}

export class EjemploImpactoDto {
  @IsString()
  monto!: string;

  @IsString()
  descripcion!: string;

  @IsInt()
  orden!: number;
}

export class ActualizarDonacionesDto {
  @IsString()
  intro!: string;

  @IsOptional()
  @IsString()
  yapeNumero?: string;

  @IsOptional()
  @IsString()
  yapeQrUrl?: string;

  @IsOptional()
  @IsString()
  plinNumero?: string;

  @IsOptional()
  @IsString()
  plinQrUrl?: string;

  @IsOptional()
  @IsString()
  paypalUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CuentaBancariaDto)
  cuentas!: CuentaBancariaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EjemploImpactoDto)
  impactos!: EjemploImpactoDto[];
}
