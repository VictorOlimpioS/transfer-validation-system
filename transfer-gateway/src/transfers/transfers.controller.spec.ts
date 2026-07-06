import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TransfersController', () => {
  let controller: TransfersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
