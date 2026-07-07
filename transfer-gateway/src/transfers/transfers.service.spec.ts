import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';
import { ClientProxy } from '@nestjs/microservices';

const mockClient = {
  emit: jest.fn(),
};

describe('TransfersService', () => {
  let service: TransfersService;

  beforeEach(() => {
    service = new TransfersService(mockClient as unknown as ClientProxy);
  });

  it('should return a transferId and PROCESSING status', () => {
    const mockDto: CreateTransferDto = {
      fromAccount: '7d3e3839-2f16-4efe-9012-b4d052295d02',
      toAccount: '0b8235b1-6e2c-49b9-9c44-6f516a48d09d',
      amount: 500,
    };

    const result = service.create(mockDto);

    //Testing service create methood calling
    expect(mockClient.emit).toHaveBeenLastCalledWith(
      'transfer_created',
      expect.any(Object),
    );

    // Testing service create method return
    expect(result.transferId).toBeDefined();
    expect(result.status).toBe('PROCESSING');
  });
});
