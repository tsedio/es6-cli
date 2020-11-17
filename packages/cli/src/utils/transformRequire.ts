import {transformOtherRequire} from "./transformOtherRequire";
import {transformSpreadRequire} from "./transformSpreadRequire";
import {transformUnspreadRequire} from "./transformUnspreadRequire";

export function transformRequire(line: string, ctx: any): boolean {
  if (transformUnspreadRequire(line, ctx)) {
    return true;
  }

  if (transformSpreadRequire(line, ctx)) {
    return true;
  }

  return transformOtherRequire(line, ctx);
}