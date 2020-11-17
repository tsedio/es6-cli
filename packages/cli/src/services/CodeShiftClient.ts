import {CliExeca, Inject} from "@tsed/cli-core";
import {Injectable} from "@tsed/di";
import {MigrateContext} from "../interfaces/MigrateContext";

@Injectable()
export class CodeShiftClient {
  @Inject()
  client: CliExeca;

  run(transformName: string, ctx: MigrateContext) {
    const cmd = require.resolve("jscodeshift/bin/jscodeshift.sh");
    const transform = require.resolve("5to6-codemod/transforms/" + transformName);

    return this.client.run(cmd, [
      "--parser",
      ctx.parser!,
      "-t",
      transform,
      ...ctx.files!
    ]);
  }
}