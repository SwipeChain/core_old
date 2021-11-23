import "jest-extended";

import { getCoreOrForgerProcessName, getOnlineProcesses } from "@packages/core-manager/src/utils";

let processManager;
const processes = [{ name: "swipechain-core" }, { name: "swipechain-forger" }, { name: "swipechain-relay" }];

beforeEach(() => {
    processManager = {
        list: jest.fn().mockReturnValue(processes),
        isOnline: jest.fn().mockReturnValue(true),
    };
});

describe("getOnlineProcesses", () => {
    it("should filter online processes", async () => {
        expect(getOnlineProcesses(processManager)).toEqual(processes);
    });
});

describe("getCoreOrForgerProcessName", () => {
    it("should return swipechain-core", async () => {
        expect(getCoreOrForgerProcessName(processes)).toEqual("swipechain-core");
    });

    it("should throw error if swipechain-core or swipechain-forger is not online process", async () => {
        expect(() => {
            getCoreOrForgerProcessName([]);
        }).toThrowError("Process with name swipechain-forger or swipechain-core is not online");
    });
});
