import { Container } from "@swipechain/core-cli";
import { Console } from "@swipechain/core-test-framework";
import { Command } from "@packages/core/src/commands/relay-start";
import os from "os";
import { resolve } from "path";

let cli;
let processManager;
beforeEach(() => {
    cli = new Console();
    processManager = cli.app.get(Container.Identifiers.ProcessManager);
});

describe("StartCommand", () => {
    it("should throw if the process does not exist", async () => {
        jest.spyOn(os, "freemem").mockReturnValue(99999999999);
        jest.spyOn(os, "totalmem").mockReturnValue(99999999999);

        const spyStart = jest.spyOn(processManager, "start").mockImplementation(undefined);

        await cli.execute(Command);

        expect(spyStart).toHaveBeenCalledWith(
            {
                args: "relay:run --token=sxp --network=testnet --v=0 --env=production",
                env: {
                    CORE_ENV: "production",
                    NODE_ENV: "production",
                },
                name: "swipechain-relay",
                node_args: undefined,
                script: resolve(__dirname, "../../../../packages/core/bin/run"),
            },
            { "kill-timeout": 30000, "max-restarts": 5, name: "swipechain-relay" },
        );
    });
});
