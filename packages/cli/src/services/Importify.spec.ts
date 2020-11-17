import {CliPlatformTest} from "@tsed/cli-testing";
import {readFileSync} from "fs";
import {MigrateContext} from "../interfaces/MigrateContext";
import {CodeShiftClient} from "./CodeShiftClient";
import {FsService} from "./FsService";
import {Importify} from "./Importify";

const rootDir = __dirname + "/__mock__/importify";

function readFile(file: string) {
  return readFileSync(file, {encoding: "utf8"});
}

describe("Importify", () => {
  beforeEach(() => CliPlatformTest.create());
  afterEach(() => CliPlatformTest.reset());

  it("should update file (test1)", async () => {
    const fs = {
      writeFileSync: jest.fn(),
      readFileSync: jest.fn().mockImplementation((file) => {
        return readFile(file);
      })
    };
    const codeShitClient = {
      run: jest.fn()
    };

    const service = await CliPlatformTest.invoke<Importify>(Importify, [
      {
        token: FsService,
        use: fs
      },
      {
        token: CodeShiftClient,
        use: codeShitClient
      }
    ]);

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
    expect(codeShitClient.run).toHaveBeenCalledWith("cjs.js", {
      files: new Set([`${rootDir}/test1.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
  it("should update file (test2)", async () => {
    const fs = {
      writeFileSync: jest.fn(),
      readFileSync: jest.fn().mockImplementation((file) => {
        return readFile(file);
      })
    };
    const codeShitClient = {
      run: jest.fn()
    };

    const service = await CliPlatformTest.invoke<Importify>(Importify, [
      {
        token: FsService,
        use: fs
      },
      {
        token: CodeShiftClient,
        use: codeShitClient
      }
    ]);

    const ctx: MigrateContext = {
      rawArgs: [],
      verbose: false,
      pattern: "/",
      parser: "babel",
      withExt: false,
      files: new Set<string>().add(`${rootDir}/test2.js`)
    };

    await service.transform(ctx);

    const content = fs.writeFileSync.mock.calls[0][1];
    const expected = readFile(rootDir + "/test2.expected.js");

    expect(content).toEqual(expected);
    expect(codeShitClient.run).toHaveBeenCalledWith("cjs.js", {
      files: new Set([`${rootDir}/test2.js`]),
      parser: "babel",
      pattern: "/",
      rawArgs: [],
      verbose: false,
      withExt: false
    });
  });
});
