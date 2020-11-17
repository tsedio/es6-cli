import {pascalCase} from "change-case";
import {basename} from "path";

const REG_DEDUP = /const (.*) = require\('(.*)'\)\((.*)\)/;
const REG_REQUIRE = /require\('(.*)'\)/;

function buildRequire({sym, baseName, next}: any): string[] {
  const matches = next.match(REG_REQUIRE);
  const content = next;
  if (matches) {
    const [, path] = matches;
    const child = pascalCase(basename(path.replace(/\.js|\.json/, "")));

    return [`const ${child} = require('${path}')`, `const ${sym} = ${baseName}(${child})`];
  }

  return [`const ${sym} = ${baseName}(${content})`];
}

export function dedupRequire(line: string): string[] {
  const matches = line.match(REG_DEDUP);

  if (matches) {
    const [, sym, path, next] = matches;
    const baseName = pascalCase(basename(path.replace(/\.js|\.json/, "")));

    return [`const ${baseName} = require('${path}')`, ...buildRequire({sym, baseName, next})];
  }

  return [line];
}
