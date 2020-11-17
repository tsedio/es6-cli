import {Inject, Injectable} from "@tsed/di";
import {dirname} from "path";
import {MigrateContext} from "../interfaces/MigrateContext";
import {dedupRequire} from "../utils/dedupRequire";
import {fixImport} from "../utils/fixImport";
import {transformRequire} from "../utils/transformRequire";
import {CodeShiftClient} from "./CodeShiftClient";
import {FsService} from "./FsService";

@Injectable()
export class Importify {
  @Inject()
  protected codeShitClient: CodeShiftClient;

  @Inject()
  protected fs: FsService;

  transform(ctx: MigrateContext) {
    ctx.files.forEach((file) => {
      let content: string = this.fs.readFileSync(file, {encoding: "utf8"});

      content = this.transformContent(file, content, ctx);

      this.fs.writeFileSync(file, content, {encoding: "utf8"});
    });

    return this.codeShitClient.run("cjs.js", ctx);
  }

  protected transformContent(file: string, content: string, ctx: MigrateContext) {
    const rootDir = dirname(file);
    const imports: string[] = [];
    let inImport = false;

    content = content
      .split("\n")
      .reduce((content: string[], line: string) => {
        return content.concat(...dedupRequire(line));
      }, [])
      .reduce((content: string[], line: string) => {
        if (inImport) {
          imports.push(line);
          inImport = !line.includes(" from ");

          return content;
        }
        if (line.startsWith("'use strict'")) {
          // use strict
          return content;
        }

        if (line.startsWith("import ")) {
          // import

          line = fixImport(line, {rootDir});

          imports.push(line);
          inImport = !line.includes(" from "); // multiline
          return content;
        }

        if (!line.includes("require(")) {
          return content.concat(line);
        }

        if (!line.startsWith("const ")) {
          // isn't a line with a top level require
          return content.concat(line);
        }

        if (transformRequire(line, {imports, rootDir, withExt: ctx.withExt})) {
          return content;
        }

        return content.concat(line);
      }, [])
      .join("\n");

    return (imports.join("\n").trim() + (imports.length ? "\n\n" : "") + content.trim()).trim() + "\n";
  }
}
