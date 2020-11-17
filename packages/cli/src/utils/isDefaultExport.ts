import {readFileSync} from "fs";

export function isDefaultExport(modPath: string) {
  const fileContent = readFileSync(`${modPath.replace(/.js$/, "")}.js`, {encoding: "utf8"});

  return fileContent.includes("export default");
}
