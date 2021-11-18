import { Interfaces } from "@swipechain/crypto";

export interface TransactionValidator {
    validate(transaction: Interfaces.ITransaction): Promise<void>;
}

export type TransactionValidatorFactory = () => TransactionValidator;
