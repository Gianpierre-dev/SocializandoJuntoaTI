import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AlmacenamientoModule } from './almacenamiento/almacenamiento.module';
import { BannersModule } from './banners/banners.module';
import { ProgramasModule } from './programas/programas.module';
import { DonacionesModule } from './donaciones/donaciones.module';
import { ActividadesModule } from './actividades/actividades.module';
import { EquipoModule } from './equipo/equipo.module';
import { AliadosModule } from './aliados/aliados.module';
import { ValoresModule } from './valores/valores.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { SemillaService } from './semilla/semilla.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AlmacenamientoModule,
    BannersModule,
    ProgramasModule,
    DonacionesModule,
    ActividadesModule,
    EquipoModule,
    AliadosModule,
    ValoresModule,
    PostulacionesModule,
    ConfiguracionModule,
  ],
  controllers: [AppController],
  providers: [AppService, SemillaService],
})
export class AppModule {}
