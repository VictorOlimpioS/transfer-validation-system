import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export type TransferData = {
  transferId: string;
  amount: number;
};

@Injectable()
export class AnalysisService {
  constructor(@Inject('GATEWAY_CLIENT') private readonly client: ClientProxy) {}

  analyzeTransfer(transfer: TransferData) {
    const isFraud = transfer.amount > 10000;
    const finalStatus = isFraud ? 'REJECTED' : 'APPROVED';

    if (!transfer.transferId || !transfer.amount) {
      console.error(
        '[ERROR] Received invalid payload, discarding message:',
        transfer,
      );
      return;
    }
    if (isFraud) {
      console.log(
        `[ALERT] Transfer ${transfer.transferId} REJECTED due to fraud suspicion. Amount: ${transfer.amount}`,
      );
    } else {
      console.log(
        `[SUCCESS] Transfer ${transfer.transferId} APPROVED. Amount: ${transfer.amount}`,
      );
    }
    this.client.emit('transfer_evaluated', {
      transferId: transfer.transferId,
      status: finalStatus,
    });
  }
}
