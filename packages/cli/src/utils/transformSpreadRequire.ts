export function transformSpreadRequire(line: string, {imports = []}: any) {
  let matches = line.match(/const {(.*)} = require\('(.*)'\)/);

  if (matches) {
    const [, exported, path] = matches;

    const line = `import {${exported}} from '${path}'`;
    if (path.startsWith(".")) {
      imports.push(line);
    } else {
      imports.unshift(line);
    }


    return line;
  }

  return false;
}

