import {getExportType} from "./getExportType";

export function transformOtherRequire(line: string, {imports = [], rootDir, withExt = false}: any) {
  const result = getExportType(line, rootDir);
  switch (result) {
    case "module-default":
      line = line.replace(/const (.*) = require\((.*)\)/, "import $1 from $2");

      imports.unshift(line);

      return true;
    case "module":
      line = line.replace(/const (.*) = require\((.*)\)/, "import * as $1 from $2");

      imports.unshift(line);

      return true;

    case "default":
      line = line
        .replace(/\.js/, "")
        .replace(/const (.*) = require\('(.*)'\)/, `import $1 from '$2${withExt ? ".js" : ""}'`);

      imports.push(line);

      return true;
    case "json":
      line = line
        .replace(/const (.*) = require\('(.*)'\)/, "import $1 from '$2'");

      imports.push(line);

      return true;
    case"json-add-ext":
      line = line.replace(/const (.*) = require\('(.*)'\)/, "import $1 from '$2.json'");

      imports.push(line);

      return true;

    case "*":
      line = line
        .replace(/\.js/, "")
        .replace(/const (.*) = require\('(.*)'\)/, `import * as $1 from '$2${withExt ? ".js" : ""}'`);

      imports.push(line);

      return true;
  }

  return false;
}