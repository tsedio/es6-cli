import {readFileSync} from "fs";

export function isDefaultExport(modPath: string) {
  const fileContent = readFileSync(`${modPath.replace(/.js$/, "")}.js`, {encoding: "utf8"});
  console.log("fil=>", fileContent);
  return (
    fileContent.includes("export default") ||
    fileContent.includes("exports.module = () =>") ||
    fileContent.includes("exports.module = function")
  );
}
