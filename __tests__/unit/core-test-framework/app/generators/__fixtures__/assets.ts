import { SandboxOptions } from "@packages/core-test-framework/src/app/contracts";

export const sandboxOptions: SandboxOptions = {
    core: {
        peers: {},
        delegates: {},
        environment: { TEST: "test" },
        app: {},
    },
    crypto: {
        flags: {
            network: "unitnet",
            premine: "15300000000000000",
            delegates: 51,
            blocktime: 8,
            maxTxPerBlock: 150,
            maxBlockPayload: 2097152,
            rewardHeight: 75600,
            rewardAmount: 200000000,
            pubKeyHash: 23,
            wif: 186,
            token: "USXP",
            symbol: "UѦ",
            explorer: "http://uexplorer.swipechain.org",
            distribute: true,
        },
        exceptions: {},
        genesisBlock: {},
        milestones: {},
        network: {},
    },
};
