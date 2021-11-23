import { Interfaces } from "@swipechain/crypto";

import { BlockProcessorResult } from "./block-processor";

export interface BlockHandler {
    execute(block?: Interfaces.IBlock): Promise<BlockProcessorResult>;
}
