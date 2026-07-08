import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransfersModule } from './transfers/transfers.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TransfersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
