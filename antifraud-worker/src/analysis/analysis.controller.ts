import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AnalysisService } from './analysis.service';

@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @EventPattern('transfer_created')
  handleTransferCreated(data: any) {
    console.log('Transferência recebida para análise:', data);
    this.analysisService.analyzeTransfer(data);
  }
}
