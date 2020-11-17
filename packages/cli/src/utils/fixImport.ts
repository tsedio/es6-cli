import {existsSync} from "fs";
import {join, resolve} from "path";
import {MODULES_WITHOUT_DEFAULT_EXPORT} from "../constants/moduleWithoutDefaultExport";
import {isDefaultExport} from "./isDefaultExport";

export function fixImport(line: string, {rootDir}: any) {
  if (!line.startsWith("import * as ") && !line.startsWith("import {")) {
    const matches = line.match(/from '(.*)'/);

    if (matches) {
      const [, filePath] = matches;
      if (!filePath.startsWith(".")) {
        if (MODULES_WITHOUT_DEFAULT_EXPORT.includes(filePath)) {
          return line.replace("import ", "import * as ");
        }

        return line;
      }

      const modPath = resolve(join(rootDir, filePath));
      try {
        if (modPath.endsWith(".json")) {
          return line;
        }

        if (existsSync(`${modPath}.json`)) {
          return line.replace(filePath, `${filePath}.json`);
        }

        return isDefaultExport(modPath) ? line : line.replace("import ", "import * as ");
      } catch (er) {
        throw new Error(`File not found: ${modPath}.js\n`);
      }
    }
  }

  return line;
}