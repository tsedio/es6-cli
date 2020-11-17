export function transformUnspreadRequire(line: string, {imports = []}: any) {
  let matches = line.match(/const (.*) = require\('(.*)'\)\.(\w+)/);

  if (matches) {
    const [, symb, path, exported] = matches;

    if (symb === exported) {
      const line = `import { ${symb} } from '${path}'`;
      imports.push(line);

      return line;
    }

    const line = `import { ${exported} as ${symb} } from '${path}'`;
    imports.push(line);

    return line;
  }

  return false;
}

