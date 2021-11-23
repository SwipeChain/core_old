import { Console } from "@swipechain/core-test-framework";
import { Command } from "@packages/core/src/commands/core-log";

let cli;
beforeEach(() => (cli = new Console()));

describe("LogCommand", () => {
    it("should throw if the process does not exist", async () => {
        await expect(cli.execute(Command)).rejects.toThrow('The "swipechain-core" process does not exist.');
    });
});
