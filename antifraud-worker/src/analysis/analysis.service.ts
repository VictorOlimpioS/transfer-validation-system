import { Injectable } from '@nestjs/common';

type TransferData = {
  transferId: string;
  amount: number;
};

@Injectable()
export class AnalysisService {
  analyzeTransfer(data: TransferData) {
    const { transferId, amount } = data;

    if (amount >= 10000) {
      console.log(
        `[ALERTA] Transferência ${transferId} REJEITADA por suspeita de fraude. Valor: ${amount}`,
      );
      // No futuro, aqui atualizaremos o banco de dados para REJECTED
    } else {
      console.log(
        `[SUCESSO] Transferência ${transferId} APROVADA. Valor: ${amount}`,
      );
      // No futuro, aqui atualizaremos o banco de dados para APPROVED
    }
  }
}
