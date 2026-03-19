import { Module } from '@nestjs/common';
import { AbelhasService } from './abelhas.service';
import { AbelhasController } from './abelhas.controller';

@Module({
  controllers: [AbelhasController],
  providers: [AbelhasService],
  exports: [AbelhasService],
})
export class AbelhasModule {}
