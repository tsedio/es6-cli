import {Command, CommandProvider, Inject} from "@tsed/cli-core";
import {Logger} from "@tsed/logger";
import {MigrateContext} from "../../interfaces/MigrateContext";
import {CleanCode} from "../../services/CleanCode";
import {CliGit} from "../../services/CliGit";
import {Exportify} from "../../services/Exportify";
import {FsService} from "../../services/FsService";
import {Importify} from "../../services/Importify";

@Command({
  name: "migrate",
  alias: "m",
  description: "Migrate directory or file to import/export ES6",
  args: {
    pattern: {
      description: "Path, directory, commit or branch name to convert file (ex: es6 migrate commit|branch|staged)",
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

  @Inject()
  cliGit: CliGit;

  $mapContext(ctx: Partial<MigrateContext>): MigrateContext {
    switch (ctx.pattern) {
      case "staged":
        ctx.pattern = this.cliGit.getStagedFiles();
        break;
      case "commit":
        ctx.pattern = this.getCommittedFiles();
        break;

      case "branch":
        ctx.pattern = this.getBranchFiles();
        break;

      default:
        ctx.pattern = ctx.pattern || this.cliGit.getStagedFiles();
        break;
    }

    return {
      ...ctx,
      files: new Set<string>()
    } as MigrateContext;
  }

  getCommittedFiles() {
    return this.cliGit
      .getCommitFiles(this.cliGit.getLastCommitID())
      .filter(({status, file}) => status !== "D" && file.endsWith(".js"))
      .map(({file}) => file);
  }

  getBranchFiles() {
    return this.cliGit
      .getBranchFiles()
      .filter(({status, file}) => status !== "D" && file.endsWith(".js"))
      .map(({file}) => file);
  }

  async $exec(ctx: MigrateContext) {
    return [
      {
        title: `Find files...`,
        task: async () => {
          ctx.files = await this.fs.scan([].concat(ctx.pattern as any).filter(Boolean), {});

          this.logger.info(`Found ${ctx.files.size} files...`);
        }
      },
      {
        title: "Transforming module.exports/exports to export...",
        skip() {
          return !ctx.files.size;
        },
        task: () => {
          return this.exportify.transform(ctx);
        }
      },
      {
        title: "Transforming require to import...",
        skip() {
          return !ctx.files.size;
        },
        task: () => {
          return this.importify.transform(ctx);
        }
      },
      {
        title: "Clean code...",
        skip() {
          return !ctx.files.size;
        },
        task: () => {
          return this.cleanCode.transform(ctx);
        }
      }
    ];
  }
}
