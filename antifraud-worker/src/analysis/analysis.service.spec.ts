import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService, TransferData } from './analysis.service';
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
  it('should not emit any status if transferId is missing', () => {
    const invalidData = {
      transferId: null,
      amount: 5000,
    };

    service.analyzeTransfer(invalidData as unknown as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if transferId is a empty string', () => {
    const invalidData = {
      transferId: '',
      amount: 5000,
    };

    service.analyzeTransfer(invalidData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if amount is null', () => {
    const invalidData = {
      transferId: '456-uuid',
      amount: null,
    };

    service.analyzeTransfer(invalidData as unknown as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if amount is NaN', () => {
    const invalidData = {
      transferId: '123-uuid',
      amount: NaN,
    };

    service.analyzeTransfer(invalidData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if transferId key is completely missing', () => {
    const invalidData = { amount: 5000 }; // Objeto sem a propriedade transferId

    service.analyzeTransfer(invalidData as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if amount is undefined', () => {
    const invalidData = {
      transferId: '123-uuid',
      amount: undefined,
    };

    service.analyzeTransfer(invalidData as unknown as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit any status if both transferId and amount are missing', () => {
    const invalidData = {
      transferId: null,
      amount: null,
    };

    service.analyzeTransfer(invalidData as unknown as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });
  it('should not emit any status if all data is missing', () => {
    const invalidData = undefined;

    service.analyzeTransfer(invalidData as unknown as TransferData);

    expect(clientProxyMock.emit).not.toHaveBeenCalled();
  });

  it('should not emit approval for zero or negative amounts', () => {
    const invalidData = {
      transferId: '456-uuid',
      amount: -500,
    };

    service.analyzeTransfer(invalidData);

    expect(clientProxyMock.emit).toHaveBeenCalledWith('transfer_evaluated', {
      transferId: '456-uuid',
      status: 'REJECTED',
    });
  });
});
