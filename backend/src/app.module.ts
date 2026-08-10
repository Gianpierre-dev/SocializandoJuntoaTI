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
  ],
  controllers: [AppController],
  providers: [AppService, SemillaService],
})
export class AppModule {}
