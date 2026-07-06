import { IsInt, IsPositive, IsUUID, Validate } from 'class-validator';
import { DifferentAccounts } from '../validators/different-accounts.validator';

export class CreateTransferDto {
  @IsUUID()
  fromAccount!: string;

  @IsUUID()
  @Validate(DifferentAccounts)
  toAccount!: string;

  @IsInt()
  @IsPositive()
  amount!: number;
}
