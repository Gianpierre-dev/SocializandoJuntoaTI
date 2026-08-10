import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EstadoActividad,
  Modalidad,
  RolUsuario,
  VarianteColor,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import * as datosIniciales from './datos-iniciales.json';

const VARIANTES: Record<string, VarianteColor> = {
  brand: VarianteColor.BRAND,
  gold: VarianteColor.GOLD,
  rose: VarianteColor.ROSE,
  green: VarianteColor.GREEN,
  deep: VarianteColor.DEEP,
  subtle: VarianteColor.SUBTLE,
};

const MODALIDADES: Record<string, Modalidad> = {
  presencial: Modalidad.PRESENCIAL,
  online: Modalidad.ONLINE,
  mixto: Modalidad.MIXTO,
};

/**
 * Carga inicial idempotente: crea el usuario administrador (si no existe)
 * y migra el contenido del sitio solo cuando las tablas están vacías.
 */
@Injectable()
export class SemillaService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SemillaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.sembrarAdministrador();
    await this.sembrarContenido();
  }

  private async sembrarAdministrador(): Promise<void> {
    const correo = this.config.get<string>('ADMIN_CORREO');
    const contrasena = this.config.get<string>('ADMIN_CONTRASENA');
    if (!correo || !contrasena) return;

    const existente = await this.prisma.usuario.findUnique({
      where: { correo },
    });
    if (existente) return;

    await this.prisma.usuario.create({
      data: {
        correo,
        nombre: 'Administración SOJAT',
        contrasena: await bcrypt.hash(contrasena, 12),
        rol: RolUsuario.ADMINISTRADOR,
      },
    });
    this.logger.log(`Usuario administrador creado: ${correo}`);
  }

  private async sembrarContenido(): Promise<void> {
    if ((await this.prisma.banner.count()) === 0) {
      await this.prisma.banner.createMany({
        data: datosIniciales.banners.map((banner) => ({
          titulo: banner.title,
          etiqueta: banner.kicker,
          descripcion: banner.description ?? null,
          enlace: banner.href,
          textoBoton: banner.ctaLabel ?? null,
          variante: VARIANTES[banner.variant ?? 'brand'],
          orden: banner.order,
        })),
      });
      this.logger.log(`Banners sembrados: ${datosIniciales.banners.length}`);
    }

    if ((await this.prisma.programa.count()) === 0) {
      await this.prisma.programa.createMany({
        data: datosIniciales.programas.map((programa) => ({
          titulo: programa.title,
          subtitulo: programa.subtitle,
          enlace: programa.href,
          variante: VARIANTES[programa.variant ?? 'brand'],
          orden: programa.order,
        })),
      });
      this.logger.log(
        `Programas sembrados: ${datosIniciales.programas.length}`,
      );
    }

    if ((await this.prisma.actividad.count()) === 0) {
      await this.prisma.actividad.createMany({
        data: datosIniciales.actividades.map((actividad) => ({
          titulo: actividad.title,
          resumen: actividad.summary,
          descripcion: actividad.description,
          costo: actividad.cost,
          modalidad: MODALIDADES[actividad.modality],
          estado:
            actividad.status === 'active'
              ? EstadoActividad.ACTIVA
              : EstadoActividad.EN_DESARROLLO,
          orden: actividad.order,
        })),
      });
      this.logger.log(
        `Actividades sembradas: ${datosIniciales.actividades.length}`,
      );
    }

    const configuracion = await this.prisma.configuracionDonaciones.findUnique({
      where: { id: 1 },
    });
    if (!configuracion) {
      const donaciones = datosIniciales.donaciones;
      await this.prisma.configuracionDonaciones.create({
        data: {
          id: 1,
          intro: donaciones.intro,
          yapeNumero: donaciones.yapeNumero || null,
          plinNumero: donaciones.plinNumero || null,
          paypalUrl: donaciones.paypalUrl || null,
          impactos: {
            create: donaciones.impactos.map((impacto, indice) => ({
              monto: impacto.monto,
              descripcion: impacto.descripcion,
              orden: indice + 1,
            })),
          },
        },
      });
      this.logger.log('Configuración de donaciones sembrada');
    }
  }
}
