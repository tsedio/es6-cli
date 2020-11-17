import {CliPlatformTest} from "@tsed/cli-testing";
import {readFileSync} from "fs";
import {MigrateContext} from "../interfaces/MigrateContext";
import {CodeShiftClient} from "./CodeShiftClient";
import {FsService} from "./FsService";
import {Exportify} from "./Exportify";

const rootDir = __dirname + "/__mock__/exportify";

function readFile(file: string) {
  return readFileSync(file, {encoding: "utf8"});
}

async function exportifyFixture() {
  const fs = {
    writeFileSync: jest.fn(),
    readFileSync: jest.fn().mockImplementation((file) => {
      return readFile(file);
    })
  };
  const codeShitClient = {
    run: jest.fn()
  };

  const service = await CliPlatformTest.invoke<Exportify>(Exportify, [
    {
      token: FsService,
      use: fs
    },
    {
      token: CodeShiftClient,
      use: codeShitClient
    }
  ]);

  return {service, fs, codeShitClient};
}

describe("Exportify", () => {
  beforeEach(() => CliPlatformTest.create());
  afterEach(() => CliPlatformTest.reset());

  it("should update file (test1)", async () => {
    const {service, fs, codeShitClient} = await exportifyFixture();
    const ctx: MigrateContext = {
      rawArgs: [],
      verbose: false,
      pattern: "/",
      parser: "babel",
      withExt: false,
      files: new Set<string>().add(`${rootDir}/test1.js`)
    };

    await service.transform(ctx);

    const content = fs.writeFileSync.mock.calls[0][1];
    const expected = readFile(rootDir + "/test1.expected.js");

    expect(content).toEqual(expected);
    expect(codeShitClient.run).toHaveBeenCalledWith("exports.js", {
      files: new Set([`${rootDir}/test1.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
  it("should update file (test6)", async () => {
    const {service, fs, codeShitClient} = await exportifyFixture();
    const ctx: MigrateContext = {
      rawArgs: [],
      verbose: false,
      pattern: "/",
      parser: "babel",
      withExt: false,
      files: new Set<string>().add(`${rootDir}/test6.js`)
    };

    await service.transform(ctx);

    const content = fs.writeFileSync.mock.calls[0][1];
    const expected = readFile(rootDir + "/test6.expected.js");

    expect(content).toEqual(expected);
    expect(codeShitClient.run).toHaveBeenCalledWith("exports.js", {
      files: new Set([`${rootDir}/test6.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
  it("should update file (test7)", async () => {
    const {service, fs, codeShitClient} = await exportifyFixture();
    const ctx: MigrateContext = {
      rawArgs: [],
      verbose: false,
      pattern: "/",
      parser: "babel",
      withExt: false,
      files: new Set<string>().add(`${rootDir}/test7.js`)
    };

    await service.transform(ctx);

    const content = fs.writeFileSync.mock.calls[0][1];
    const expected = readFile(rootDir + "/test7.expected.js");

    expect(content).toEqual(expected);
    expect(codeShitClient.run).toHaveBeenCalledWith("exports.js", {
      files: new Set([`${rootDir}/test7.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
  it("should update file (test8)", async () => {
    const {service, fs, codeShitClient} = await exportifyFixture();
    const ctx: MigrateContext = {
      rawArgs: [],
      verbose: false,
      pattern: "/",
      parser: "babel",
      withExt: false,
      files: new Set<string>().add(`${rootDir}/test8.js`)
    };

    await service.transform(ctx);

    const content = fs.writeFileSync.mock.calls[0][1];
    const expected = readFile(rootDir + "/test8.expected.js");

    expect(content).toEqual(expected);
    expect(codeShitClient.run).toHaveBeenCalledWith("exports.js", {
      files: new Set([`${rootDir}/test8.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
});
