import {Inject, Injectable} from "@tsed/di";
import {readFileSync, writeFileSync} from "fs";
import {MigrateContext} from "../interfaces/MigrateContext";
import {CodeShiftClient} from "./CodeShiftClient";
import {FsService} from "./FsService";

@Injectable()
export class Exportify {
  @Inject()
  protected codeShitClient: CodeShiftClient;

  @Inject()
  protected fs: FsService;

  transform(ctx: MigrateContext) {
    ctx.files
      .forEach((file) => {
        let content: string = this.fs.readFileSync(file, {encoding: "utf8"});

        content = this.transformContent(content);

        this.fs.writeFileSync(file, content, {encoding: "utf8"});
      });

    return this.codeShitClient.run("exports.js", ctx);
  }

  protected transformContent(content: string) {
    let inModuleExports = false;
    let exported: string[] = [];

    return content.split("\n").reduce((content: string[], line: string) => {
      if (line.startsWith("module.exports = {")) {
        inModuleExports = true;
        return content;
      }

      if (inModuleExports && line.startsWith("}")) {
        inModuleExports = false;

        if (exported.length) {
          return [
            ...content,
            "export {",
            ...exported,
            "}"
          ];
        }

        return content;
      }

      if (inModuleExports) {
        line = line.replace("  ", "");
        let matches = line.replace("async ", "").match(/^(\w+) \((.*)/);

        if (matches) {
          const [, name, params] = matches;
          const isAsync = line.includes("async ");
          return content.concat(`export ${isAsync ? "async " : ""}function ${name} (${params}`);
        }

        matches = line.match(/^(\w+): (.*)/);

        if (matches) {
          const [, name, params] = matches;

          return content.concat(`export const ${name} = ${params}`);
        }


        if (line.match(/^(\w+),$/) || line.match(/^(\w+)$/)) {
          exported.push(`  ${line}`);
          return content;
        }

        if (line.match(/^},/)) {
          return content.concat("}");
        }

        return content.concat(line);
      }

      return content.concat(line);
    }, []).join("\n");
  }
}