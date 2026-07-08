import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

describe('AnalysisService', () => {
  let service: AnalysisService;

  let clientProxyMock: { emit: jest.Mock };

  beforeEach(async () => {
    clientProxyMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: 'GATEWAY_CLIENT',
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should approve a transfer when the amount is less than  10000', () => {
    const transferData = {
      transferId: '123-uuid',
      amount: 5000,
    };

    service.analyzeTransfer(transferData);

    expect(clientProxyMock.emit).toHaveBeenCalledWith('transfer_evaluated', {
      transferId: '123-uuid',
      status: 'APPROVED',
    });
  });

  it('should reject a transfer when the amount is greater than  10000', () => {
    const transferData = {
      transferId: '456-uuid',
      amount: 15000,
    };

    service.analyzeTransfer(transferData);

    expect(clientProxyMock.emit).toHaveBeenCalledWith('transfer_evaluated', {
      transferId: '456-uuid',
      status: 'REJECTED',
    });
  });

  it('should reject a transfer when the amount is equal  to  10001', () => {
    const transferData = {
      transferId: '456-uuid',
      amount: 10001,
    };

    service.analyzeTransfer(transferData);

    expect(clientProxyMock.emit).toHaveBeenCalledWith('transfer_evaluated', {
      transferId: '456-uuid',
      status: 'REJECTED',
    });
  });

  it('should approve a transfer when the amount is equal  to 10000', () => {
    const transferData = {
      transferId: '456-uuid',
      amount: 10000,
    };

    service.analyzeTransfer(transferData);

    expect(clientProxyMock.emit).toHaveBeenCalledWith('transfer_evaluated', {
      transferId: '456-uuid',
      status: 'APPROVED',
    });
  });
});
