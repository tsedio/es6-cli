#!/usr/bin/env node
import {Cli} from "@tsed/cli-core";
import {resolve} from "path";
import commands from "../commands";

const pkg = require("../../package.json");
const TEMPLATE_DIR = resolve(__dirname, "..", "..", "templates");

async function bootstrap() {
  const cli = await Cli.bootstrap({
    name: "es6",
    pkg,
    templateDir: TEMPLATE_DIR,
    commands: [...commands]
  });

  cli.parseArgs();
}

bootstrap();
