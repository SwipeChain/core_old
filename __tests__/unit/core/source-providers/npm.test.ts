import "jest-extended";

import { NPM } from "@packages/core/src/source-providers";
import fs from "fs-extra";
import nock from "nock";
import { join, resolve } from "path";
import { dirSync, setGracefulCleanup } from "tmp";
import execa from "execa";

let dataPath: string;
let tempPath: string;
let source: NPM;

beforeEach(() => {
    dataPath = dirSync().name;
    tempPath = dirSync().name;

    source = new NPM({ data: dataPath, temp: tempPath });

    nock.cleanAll();
});

beforeEach(() => {
    setGracefulCleanup();

    nock.disableNetConnect();
});

afterEach(() => nock.enableNetConnect());

describe("NPM", () => {
    describe("#exists", () => {
        it("should return true if the file exists", async () => {
            nock(/.*/)
                .get("/@swipechain/utils")
                .reply(200, {
                    name: "@swipechain/utils",
                    "dist-tags": {
                        latest: "0.9.1",
                    },
                    versions: {
                        "0.9.1": {
                            name: "@swipechain/utils",
                            version: "0.9.1",
                            dist: {
                                tarball: "https://registry.npmjs.org/@swipechain/utils/-/utils-0.9.1.tgz",
                            },
                        },
                    },
                });

            await expect(source.exists("@swipechain/utils")).resolves.toBeTrue();
        });

        it("should return false if the file does not exists", async () => {
            await expect(source.exists("does not exist")).resolves.toBeFalse();
        });
    });

    describe("#update", () => {
        it("should successfully install the plugin", async () => {
            nock(/.*/)
                .get("/@swipechain/utils")
                .reply(200, {
                    name: "@swipechain/utils",
                    "dist-tags": {
                        latest: "0.9.1",
                    },
                    versions: {
                        "0.9.1": {
                            name: "@swipechain/utils",
                            version: "0.9.1",
                            dist: {
                                tarball: "https://registry.npmjs.org/@swipechain/utils/-/utils-0.9.1.tgz",
                            },
                        },
                    },
                });

            nock(/.*/)
                .get("/@swipechain/utils/-/utils-0.9.1.tgz")
                .reply(200, fs.readFileSync(resolve(__dirname, "utils-0.9.1.tgz")));

            // Arrange
            const removeSync = jest.spyOn(fs, "removeSync");
            const ensureFileSync = jest.spyOn(fs, "ensureFileSync");
            const moveSync = jest.spyOn(fs, "moveSync");
            const spyOnExeca = jest.spyOn(execa, "sync").mockImplementation();

            // Act
            const packageName: string = "@swipechain/utils";
            await source.update(packageName);

            // Assert
            const pathPlugin: string = `${dataPath}/${packageName}`;
            expect(removeSync).toHaveBeenCalledWith(pathPlugin);
            expect(ensureFileSync).toHaveBeenCalledWith(`${tempPath}/${packageName}.tgz`);
            expect(removeSync).toHaveBeenCalledWith(pathPlugin);
            expect(moveSync).toHaveBeenCalledWith(`${tempPath}/package`, pathPlugin);
            expect(removeSync).toHaveBeenCalledWith(pathPlugin);
            expect(removeSync).toHaveBeenCalledWith(`${tempPath}/${packageName}.tgz`);
            expect(spyOnExeca).toHaveBeenCalledWith(`yarn`, ["install", "--production"], {
                cwd: join(dataPath, packageName),
            });

            // Reset
            removeSync.mockReset();
            ensureFileSync.mockReset();
            moveSync.mockReset();
        });
    });
});
