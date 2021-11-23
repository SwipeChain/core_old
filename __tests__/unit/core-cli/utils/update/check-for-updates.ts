import "jest-extended";

import { checkForUpdates } from "@packages/core/src/common/update";
import nock from "nock";

import { versionLatest } from "../__fixtures__/latest-version";

beforeEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

afterAll(() => nock.enableNetConnect());

describe("checkForUpdates", () => {
    it("should fail to find a new version if the npm registry is down", async () => {
        const warn = jest.fn();
        await expect(
            checkForUpdates({
                config: {
                    name: "@swipechain/core",
                    version: "2.5.24",
                },
                warn,
            }),
        ).resolves.toEqual({
            ready: false,
            name: "@swipechain/core",
            currentVersion: "2.5.24",
            channel: "latest",
        });

        expect(warn).toHaveBeenCalledWith('We were unable to find any releases for the "latest" channel.');
    });

    it("should find a new version if the npm registry is up", async () => {
        nock(/.*/).get("/@swipechain%2Fcore").reply(200, versionLatest);

        await expect(
            checkForUpdates({
                config: {
                    name: "@swipechain/core",
                    version: "2.5.19",
                },
                warn: jest.fn(),
            }),
        ).resolves.toEqual({
            ready: true,
            name: "@swipechain/core",
            currentVersion: "2.5.19",
            updateVersion: "2.5.24",
            channel: "latest",
        });
    });
});
