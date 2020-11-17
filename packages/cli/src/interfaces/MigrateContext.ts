import {CliDefaultOptions} from "@tsed/cli-core";

export interface MigrateContext extends CliDefaultOptions {
  pattern: string;
  parser: string;
  files: Set<string>;
  withExt: boolean;
}