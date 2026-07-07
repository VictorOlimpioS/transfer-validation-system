import { Inject, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { randomUUID } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('ANTI_FRAUD_CLIENT')
    private readonly client: ClientProxy,
  ) {}
  create(createTransferDto: CreateTransferDto) {
    const transferId = randomUUID();

    this.client.emit('transfer_created', { transferId, ...createTransferDto });

    return {
      transferId,
      status: 'PROCESSING',
    };
  }
}
