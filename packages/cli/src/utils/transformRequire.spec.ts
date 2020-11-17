const path = require("path");
const {transformRequire} = require("./transformRequire");
const rootDir = path.resolve(__dirname + "/__mock__");

describe("transformRequire", () => {
  it("should transform requires", () => {
    const imports: string[] = [];
    const ctx = {imports, rootDir};

    transformRequire("const test = require('./').test", ctx);
    transformRequire("const test = require('./').blob", ctx);
    transformRequire("const { test } = require('./')", ctx);
    transformRequire("const ExportDefaultClient = require('./exports.default.js')", ctx);
    transformRequire("const ExportClient = require('./exports.js')", ctx);
    transformRequire("const jsonData = require('./exports-test.json')", ctx);
    transformRequire("const jsonData = require('./exports-test')", ctx);
    transformRequire("const { get } = require('lodash')", ctx);
    transformRequire("const get = require('lodash/get')", ctx);
    transformRequire("const _ = require('lodash')", ctx);

    expect(imports).toEqual([
      "import _ from 'lodash'",
      "import get from 'lodash/get'",
      "import { get } from 'lodash'",
      "import { test } from './'",
      "import { blob as test } from './'",
      "import { test } from './'",
      "import ExportDefaultClient from './exports.default'",
      "import * as ExportClient from './exports'",
      "import jsonData from './exports-test.json'",
      "import jsonData from './exports-test.json'"
    ]);
  });

  it("should transform requires (withExt)", () => {
    const imports: string[] = [];
    const ctx = {imports, rootDir, withExt: true};

    transformRequire("const test = require('./').test", ctx);
    transformRequire("const test = require('./').blob", ctx);
    transformRequire("const { test } = require('./')", ctx);
    transformRequire("const ExportDefaultClient = require('./exports.default.js')", ctx);
    transformRequire("const ExportClient = require('./exports.js')", ctx);
    transformRequire("const jsonData = require('./exports-test.json')", ctx);
    transformRequire("const jsonData = require('./exports-test')", ctx);
    transformRequire("const { get } = require('lodash')", ctx);
    transformRequire("const get = require('lodash/get')", ctx);
    transformRequire("const _ = require('lodash')", ctx);

    expect(imports).toEqual([
      "import _ from 'lodash'",
      "import get from 'lodash/get'",
      "import { get } from 'lodash'",
      "import { test } from './'",
      "import { blob as test } from './'",
      "import { test } from './'",
      "import ExportDefaultClient from './exports.default.js'",
      "import * as ExportClient from './exports.js'",
      "import jsonData from './exports-test.json'",
      "import jsonData from './exports-test.json'"
    ]);
  });
});
