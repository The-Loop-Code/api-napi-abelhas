import { Module } from '@nestjs/common';
import { CidadesIbgeService } from './cidades-ibge.service';
import { CidadesIbgeController } from './cidades-ibge.controller';

@Module({
  controllers: [CidadesIbgeController],
  providers: [CidadesIbgeService],
  exports: [CidadesIbgeService],
})
export class CidadesIbgeModule {}
