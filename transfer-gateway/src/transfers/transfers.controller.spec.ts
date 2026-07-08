import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RmqContext } from '@nestjs/microservices';
import { CreateTransferDto } from './dto/create-transfer.dto';

describe('TransfersController', () => {
  let controller: TransfersController;

  const mockTransfersService = {
    create:
      jest.fn<
        (
          createTransferDto: CreateTransferDto,
        ) => Promise<{ transferId: string; status: string }>
      >(),
    updateStatus:
      jest.fn<
        (
          id: string,
          newStatus: string,
        ) => Promise<{ id: string; status: string }>
      >(),
  };

  const mockChannel = {
    ack: jest.fn(),
    nack: jest.fn(),
  };
  const mockMessage = { content: 'test-message' };

  const mockRmqContext = {
    getChannelRef: jest.fn().mockReturnValue(mockChannel),
    getMessage: jest.fn().mockReturnValue(mockMessage),
  } as unknown as RmqContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: mockTransfersService,
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransfer', () => {
    it('should call service.create with correct DTO', async () => {
      const mockDto: CreateTransferDto = {
        fromAccount: 'conta-A',
        toAccount: 'conta-B',
        amount: 500,
      };

      await controller.createTransfer(mockDto);

      expect(mockTransfersService.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('handleTransferEvaluated', () => {
    const mockPayload = {
      transferId: '123-uuid',
      status: 'APPROVED',
    };

    it('should update status and ack the message on success', async () => {
      await controller.handleTransferEvaluated(mockPayload, mockRmqContext);

      expect(mockTransfersService.updateStatus).toHaveBeenCalledWith(
        mockPayload.transferId,
        mockPayload.status,
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
      expect(mockChannel.nack).not.toHaveBeenCalled();
    });

    it('should nack the message if an error occurs', async () => {
      mockTransfersService.updateStatus.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await controller.handleTransferEvaluated(mockPayload, mockRmqContext);

      expect(mockChannel.nack).toHaveBeenCalledWith(mockMessage, false, true);
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });
  });
});
