import { Module } from '@nestjs/common';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [AnalysisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
