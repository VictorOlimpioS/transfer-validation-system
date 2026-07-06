import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TransfersService {
  create(createTransferDto: CreateTransferDto) {
    const transferId = randomUUID();

    console.log('Transfer received:', { transferId, ...createTransferDto });

    return {
      transferId,
      status: 'PROCESSING',
    };
  }
}
