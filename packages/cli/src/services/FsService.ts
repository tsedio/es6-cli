import {CliFs} from "@tsed/cli-core";
import {Injectable} from "@tsed/di";
import * as globby from "globby";

const normalizePath = require("normalize-path");

@Injectable()
export class FsService extends CliFs {
  readFileSync(file: string | Buffer | number, encoding?: any): string {
    return this.raw.readFileSync(file, encoding) as any;
  }

  async scan(pattern: string[], options: any = {}): Promise<Set<string>> {
    const files = await globby(
      pattern.map((s: string) => normalizePath(s)),
      {
        ...options,
        cwd: process.cwd()
      }
    );

    return new Set(files);
  }
}
