import { Interfaces } from "@swipechain/crypto";

export interface ExpirationService {
    canExpire(transaction: Interfaces.ITransaction): boolean;
    isExpired(transaction: Interfaces.ITransaction): Promise<boolean>;
    getExpirationHeight(transaction: Interfaces.ITransaction): Promise<number>;
}
