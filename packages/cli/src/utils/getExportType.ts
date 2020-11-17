import {existsSync} from "fs";
import {resolve, join} from "path";
import {MODULES_WITHOUT_DEFAULT_EXPORT} from "../constants/moduleWithoutDefaultExport";
import {isDefaultExport} from "./isDefaultExport";

export function getExportType(file: string, rootDir: any) {
  const matches = file.match(/require\('(.*)'\)/);

  if (matches) {
    const filePath = matches[1];
    if (!filePath.startsWith(".")) {
      if (MODULES_WITHOUT_DEFAULT_EXPORT.includes(filePath)) {
        return "module";
      }

      return "module-default";
    }

    const modPath = resolve(join(rootDir, filePath));

    if (modPath.endsWith(".json")) {
      return "json";
    }

    if (existsSync(`${modPath}.json`)) {
      return "json-add-ext";
    }

    try {
      return isDefaultExport(modPath) ? "default" : "*";
    } catch (er) {
      throw new Error(`File not found: ${modPath}.js\n`);
    }
  }

  return null;
}
