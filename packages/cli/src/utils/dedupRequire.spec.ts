import {dedupRequire} from "./dedupRequire";

describe("dedupRequire", () => {
  it("should dedup require", () => (
    expect(dedupRequire("const logger = require('./some/logger')(require('./some/config'))")).toEqual([
      "const Logger = require('./some/logger')",
      "const Config = require('./some/config')",
      "const logger = Logger(Config)"
    ])
  ));
});