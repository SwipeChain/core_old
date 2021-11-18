import { Interfaces } from "@swipechain/crypto";

export interface DownloadBlock extends Omit<Interfaces.IBlockData, "transactions"> {
    transactions: string[];
}
