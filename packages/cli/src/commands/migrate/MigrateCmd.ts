import {Command, CommandProvider, Inject} from "@tsed/cli-core";
import {Logger} from "@tsed/logger";
import {MigrateContext} from "../../interfaces/MigrateContext";
import {CleanCode} from "../../services/CleanCode";
import {Exportify} from "../../services/Exportify";
import {FsService} from "../../services/FsService";
import {Importify} from "../../services/Importify";

@Command({
  name: "migrate",
  alias: "m",
  description: "Migrate directory or file to import/export ES6",
  args: {
    pattern: {
      description: "Path or directory to convert file",
      type: String
    }
  },
  options: {
    "-p, --parser <type>": {
      type: String,
      defaultValue: "babel",
      description: "choose the parser that should be used with jscodeshift (babel, babylon, flow)"
    }
  }
})
export class MigrateCmd implements CommandProvider {
  @Inject()
  fs: FsService;

  @Inject()
  exportify: Exportify;

  @Inject()
  importify: Importify;

  @Inject()
  cleanCode: CleanCode;

  @Inject()
  logger: Logger;

  $mapContext(ctx: Partial<MigrateContext>): MigrateContext {
    return {
      ...ctx,
      files: new Set<string>()
    } as MigrateContext;
  }

  async $exec(ctx: MigrateContext) {
    return [
      {
        title: `Find files...`,
        task: async () => {
          ctx.files = await this.fs.scan([ctx.pattern], {});

          this.logger.info(`Found ${ctx.files.size} files...`);
        }
      },
      {
        title: "Transforming module.exports/exports to export...",
        task: () => {
          return this.exportify.transform(ctx);
        }
      },
      {
        title: "Transforming require to import...",
        task: () => {
          return this.importify.transform(ctx);
        }
      },
      {
        title: "Clean code...",
        task: () => {
          return this.cleanCode.transform(ctx);
        }
      }
    ];
  }
}
