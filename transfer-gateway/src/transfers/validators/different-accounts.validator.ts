import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DifferentAccounts', async: false })
export class DifferentAccounts implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const dto = validationArguments?.object as Record<string, string>;
    return value !== dto.fromAccount;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} não pode ser igual à conta de origem`;
  }
}
