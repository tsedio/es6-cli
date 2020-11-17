import {Injectable} from "@tsed/di";
import {readFileSync, writeFileSync} from "fs";
import {MigrateContext} from "../interfaces/MigrateContext";

@Injectable()
export class CleanCode {
  private static cleanExports(line: string) {
    if (line.includes("exports.") && !line.startsWith("exports.")) {
      return line.replace(/exports\./gi, "");
    }

    return line;
  }

  private static addLineBeforeExport(content: string[], line: string) {
    if (content.length > 0) {
      const prev = content[content.length - 1].trim();

      if (line.startsWith("export ") && prev && !prev.includes("*/")) {
        return content.concat("", line);
      }

      if (line.startsWith("function ") && prev && !prev.includes("*/")) {
        return content.concat("", line);
      }

      if (line.startsWith("/**") && prev) {
        return content.concat("", line);
      }
    }

    return content.concat(line);
  }

  private static removeSemicolon(line: string, index: number, content: string[]) {
    if ((content[index + 1] || "").trim().startsWith("[")) {
      return line;
    }

    return line.replace(/;$/, "");
  }

  private static transformContent(content: string) {
    return content
      .split("\n")
      .map(CleanCode.cleanExports)
      .reduce(CleanCode.addLineBeforeExport, [])
      .map(CleanCode.removeSemicolon)
      .join("\n");
  }

  transform(ctx: MigrateContext) {
    ctx.files.forEach((file) => {
      let content = readFileSync(file, {encoding: "utf8"});

      content = CleanCode.transformContent(content);

      writeFileSync(file, content, {encoding: "utf8"});
    });
  }
}
