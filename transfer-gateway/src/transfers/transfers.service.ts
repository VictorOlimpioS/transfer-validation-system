import { Inject, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('ANTI_FRAUD_CLIENT')
    private readonly client: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}
  async create(createTransferDto: CreateTransferDto) {
    const transfer = await this.prisma.transfer.create({
      data: {
        fromAccount: createTransferDto.fromAccount,
        toAccount: createTransferDto.toAccount,
        amount: createTransferDto.amount,
      },
    });

    this.client.emit('transfer_created', {
      transferId: transfer.id,
      ...createTransferDto,
    });

    return {
      transferId: transfer.id,
      status: transfer.status,
    };
  }

  async updateStatus(id: string, newStatus: string) {
    const updatedTransfer = await this.prisma.transfer.update({
      where: { id: id },
      data: { status: newStatus },
    });

    console.log(
      `[BANCO ATUALIZADO] Transferência ${id} agora está ${newStatus}!`,
    );

    return updatedTransfer;
  }
}
