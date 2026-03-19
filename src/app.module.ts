import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProducersModule } from './producers/producers.module';
import { SamplesModule } from './samples/samples.module';
import { AnalysisModule } from './analysis/analysis.module';
import { StorageModule } from './storage/storage.module';
import { CidadesIbgeModule } from './cidades-ibge/cidades-ibge.module';
import { ResponsaveisModule } from './responsaveis/responsaveis.module';
import { TiposAmostraModule } from './tipos-amostra/tipos-amostra.module';
import { TiposAnaliseModule } from './tipos-analise/tipos-analise.module';
import { AbelhasModule } from './abelhas/abelhas.module';
import { PontosColetaModule } from './pontos-coleta/pontos-coleta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        ttl: 60000,
      }),
    }),
    PrismaModule,
    AuthModule,
    ProducersModule,
    SamplesModule,
    AnalysisModule,
    StorageModule,
    CidadesIbgeModule,
    ResponsaveisModule,
    TiposAmostraModule,
    TiposAnaliseModule,
    AbelhasModule,
    PontosColetaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
