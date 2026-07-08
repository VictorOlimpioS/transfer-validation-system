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
    if (
      !transfer ||
      !transfer.transferId ||
      transfer.amount == null ||
      Number.isNaN(transfer.amount)
    ) {
      console.error(
        '[ERROR] Received invalid payload, discarding message:',
        transfer,
      );
      return;
    }

    const isFraud = transfer.amount > 10000;
    const isInvalidAmount = transfer.amount <= 0;

    if (isFraud || isInvalidAmount) {
      const reason = isFraud ? 'fraud suspicion' : 'invalid amount';

      console.log(
        `[ALERT] Transfer ${transfer.transferId} REJECTED due to ${reason}. Amount: ${transfer.amount}`,
      );
      this.client.emit('transfer_evaluated', {
        transferId: transfer.transferId,
        status: 'REJECTED',
      });
    } else {
      console.log(
        `[SUCCESS] Transfer ${transfer.transferId} APPROVED. Amount: ${transfer.amount}`,
      );
      this.client.emit('transfer_evaluated', {
        transferId: transfer.transferId,
        status: 'APPROVED',
      });
    }
  }
}
