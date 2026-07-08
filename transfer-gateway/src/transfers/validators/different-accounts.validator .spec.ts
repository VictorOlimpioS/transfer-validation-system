import { describe, it, beforeEach, expect } from '@jest/globals';
import { DifferentAccounts } from './different-accounts.validator';
import { ValidationArguments } from 'class-validator';

const mockArguments = {
  property: 'targetAccountId',
} as ValidationArguments;

describe('DifferentAccounts', () => {
  let validator: DifferentAccounts;

  beforeEach(() => {
    validator = new DifferentAccounts();
  });

  it('should return true when accounts are different', () => {
    const value = 'a6f65fbf-b538-4457-8244-b55d907fea29';
    const args = {
      object: { fromAccount: '4916026b-fa09-4991-bec9-f83664ebc2db' },
    } as ValidationArguments;

    const result = validator.validate(value, args);

    expect(result).toBe(true);
  });

  it('should return false when accounts are the same', () => {
    const value = 'a6f65fbf-b538-4457-8244-b55d907fea29';
    const args = {
      object: { fromAccount: 'a6f65fbf-b538-4457-8244-b55d907fea29' },
    } as ValidationArguments;

    const result = validator.validate(value, args);

    expect(result).toBe(false);
  });

  it('should return the default error message', () => {
    const result = validator.defaultMessage!(mockArguments);
    expect(result).toBe(
      'targetAccountId cannot be the same as the source account',
    );
  });
});
