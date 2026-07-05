import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
