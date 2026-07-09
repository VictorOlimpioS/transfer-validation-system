import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

export type TransferEvaluatedPayload = {
  transferId: string;
  status: string;
};

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @HttpCode(202)
  @Post()
  createTransfer(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @EventPattern('transfer_evaluated')
  async handleTransferEvaluated(
    @Payload() data: TransferEvaluatedPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      console.log('O Gateway ouviu a resposta do Worker:', data);

      await this.transfersService.updateStatus(data.transferId, data.status);

      channel.ack(originalMsg);
    } catch (error) {
      console.error(
        `[ERRO CRÍTICO] Falha ao atualizar banco para a transferência ${data.transferId}:`,
        error,
      );

      channel.nack(originalMsg, false, true);
    }
  }
}
