import { beforeEach, describe, expect, it } from '@jest/globals';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  let service: TransfersService;

  beforeEach(() => {
    service = new TransfersService();
  });

  it('should return a transferId and PROCESSING status', () => {
    const mockDto: CreateTransferDto = {
      fromAccount: '7d3e3839-2f16-4efe-9012-b4d052295d02',
      toAccount: '0b8235b1-6e2c-49b9-9c44-6f516a48d09d',
      amount: 500,
    };

    const result = service.create(mockDto);

    expect(result.transferId).toBeDefined();
    expect(result.status).toBe('PROCESSING');
  });
});
