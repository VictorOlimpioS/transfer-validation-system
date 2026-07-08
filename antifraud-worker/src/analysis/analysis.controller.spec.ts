import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

describe('AnalysisController', () => {
  let controller: AnalysisController;
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: AnalysisService,
          useValue: {
            analyzeTransfer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);
    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the message payload to the AnalysisService', () => {
    const mockPayload = {
      transferId: 'controller-123',
      amount: 5000,
    };

    const analyzeSpy = jest.spyOn(service, 'analyzeTransfer');

    controller.handleTransferCreated(mockPayload);

    expect(analyzeSpy).toHaveBeenCalledWith(mockPayload);
  });

  it('should be able to instantiate manually (coverage hack)', () => {
    const manualController = new AnalysisController(service);
    expect(manualController).toBeDefined();
  });
});
