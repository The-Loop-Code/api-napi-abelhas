import { Module } from '@nestjs/common';
import { TiposAmostraService } from './tipos-amostra.service';
import { TiposAmostraController } from './tipos-amostra.controller';

@Module({
  controllers: [TiposAmostraController],
  providers: [TiposAmostraService],
  exports: [TiposAmostraService],
})
export class TiposAmostraModule {}
