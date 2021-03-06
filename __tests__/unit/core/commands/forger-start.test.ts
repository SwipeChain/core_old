import { Container } from "@swipechain/core-cli";
import { Console } from "@swipechain/core-test-framework";
import { Command } from "@packages/core/src/commands/forger-start";
import { writeJSONSync } from "fs-extra";
import os from "os";
import { resolve } from "path";
import { dirSync, setGracefulCleanup } from "tmp";

let cli;
let processManager;
beforeEach(() => {
    process.env.CORE_PATH_CONFIG = dirSync().name;

    writeJSONSync(`${process.env.CORE_PATH_CONFIG}/delegates.json`, { secrets: ["bip39"] });

    cli = new Console();
    processManager = cli.app.get(Container.Identifiers.ProcessManager);
});

afterAll(() => setGracefulCleanup());

describe("StartCommand", () => {
    it("should throw if the process does not exist", async () => {
        jest.spyOn(os, "freemem").mockReturnValue(99999999999);
        jest.spyOn(os, "totalmem").mockReturnValue(99999999999);

        const spyStart = jest.spyOn(processManager, "start").mockImplementation(undefined);

        await cli.execute(Command);

        expect(spyStart).toHaveBeenCalledWith(
            {
                args: "forger:run --token=sxp --network=testnet --v=0 --env=production",
                env: {
                    CORE_ENV: "production",
                    NODE_ENV: "production",
                },
                name: "swipechain-forger",
                node_args: undefined,
                script: resolve(__dirname, "../../../../packages/core/bin/run"),
            },
            { "kill-timeout": 30000, "max-restarts": 5, name: "swipechain-forger" },
        );
    });
});
