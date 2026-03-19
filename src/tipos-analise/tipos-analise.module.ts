import { Module } from '@nestjs/common';
import { TiposAnaliseService } from './tipos-analise.service';
import { TiposAnaliseController } from './tipos-analise.controller';

@Module({
  controllers: [TiposAnaliseController],
  providers: [TiposAnaliseService],
  exports: [TiposAnaliseService],
})
export class TiposAnaliseModule {}
