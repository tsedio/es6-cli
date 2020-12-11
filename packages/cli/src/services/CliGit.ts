import {CliExeca} from "@tsed/cli-core";
import {Inject} from "@tsed/di";
import {spawnSync, SpawnSyncOptionsWithStringEncoding} from "child_process";
import * as execa from "execa";

export interface ChainedCli extends Promise<string> {
  cwd(cwd: string): this;

  sync(options?: execa.SyncOptions): execa.ExecaSyncReturnValue<string>;

  getRaw(options?: SpawnSyncOptionsWithStringEncoding): string;

  get(): string;
}

export interface GitBranchInfo {
  branch: string;
  date: string;
  creation: string;
  author: string;
}

export class CliGit {
  @Inject()
  execaCli: CliExeca;

  static getRaw(cmd: string, args: string[], options: SpawnSyncOptionsWithStringEncoding) {
    return spawnSync(cmd, args, options)
      .output.filter((o) => !!o)
      .map((o) => o.toString())
      .join("\n")
      .trim();
  }

  run(cmd: string, args: string[] = [], options: Partial<execa.Options> & any = {}): ChainedCli {
    const run = (opt: execa.Options = {}) => {
      return this.execaCli.raw(cmd, args, {
        cwd: process.cwd(),
        ...opt,
        ...options
      });
    };

    let isPromise = true;

    const promise: any = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isPromise) {
          try {
            const result = await run({
              stdio: "inherit"
            });

            resolve(result);
          } catch (err) {
            // eslint-disable-next-line no-console
            reject(err);
          }
        } else {
          resolve();
        }
      }, 10);
    });

    promise.cwd = (cwd: string) => {
      options.cwd = cwd;
      return promise;
    };

    promise.sync = (opt: execa.SyncOptions) => {
      isPromise = false;

      return this.execaCli.runSync(cmd, args, {
        cwd: process.cwd(),
        stdio: "inherit",
        ...options,
        ...opt
      });
    };

    promise.getRaw = (opt: any) => {
      isPromise = false;
      return CliGit.getRaw(cmd, args, {
        cwd: process.cwd(),
        ...options,
        ...opt
      });
    };

    promise.get = () => {
      isPromise = false;

      return this.execaCli.get(cmd, args, {
        cwd: process.cwd()
      });
    };

    return promise as ChainedCli;
  }

  branch(...args: any[]) {
    return this.run("git", ["branch", ...args]);
  }

  show(branch: string) {
    return this.run("git", ["show", '--format="%ci|%cr|%an"', branch, "--"])
      .getRaw()
      .split("\n")[0]
      .trim();
  }

  branches(options: any): string[] {
    return this.branch()
      .getRaw(options)
      .split("\n")
      .map((branch) => branch.trim().replace("* ", ""))
      .filter((branch) => !!branch)
      .filter((branch) => !String(branch).includes("/HEAD"));
  }

  branchesInfos(options: any): GitBranchInfo[] {
    const infos = this.branches(options)
      .map((branch) => {
        try {
          const [date, creation, author] = this.show(branch).split("|");
          return {
            branch,
            date,
            creation,
            author
          } as GitBranchInfo;
        } catch (er) {
          return undefined;
        }
      })
      .filter(Boolean) as GitBranchInfo[];

    return infos.sort((info1: GitBranchInfo, info2: GitBranchInfo) => (info1.date < info2.date ? 1 : -1));
  }

  getLastCommitID(options?: any) {
    return this.run("git", ["rev-parse", "HEAD"])
      .getRaw(options)
      .trim();
  }

  getCommitFiles(commitId: string, options?: any): {status: string; file: string}[] {
    return this.run("git", ["diff-tree", "--no-commit-id", "--name-status", "-r", commitId])
      .getRaw(options)
      .split("\n")
      .map((line) => {
        const [status, ...file] = line.trim().split("\t");
        return {
          status,
          file: file.join(" ").trim()
        };
      });
  }

  getStagedFiles(): string[] {
    const files = this.execaCli.get("git", ["ls-files", "--other", "--modified", "--exclude-standard"]);

    return files.split("\n");
  }

  getBranchFiles(options?: any): {status: string; file: string}[] {
    const main = this.getMainBranch(options);

    return this.run("git", ["diff", "--name-status", `origin/${main}`])
      .getRaw()
      .split("\n")
      .map((line) => {
        const [status, ...file] = line.trim().split("\t");
        return {
          status,
          file: file.join(" ").trim()
        };
      });
  }

  getMainBranch(options?: any) {
    const branches = this.branchesInfos(options);
    return (
      branches.find(({branch}) => branch === "main") ||
      branches.find(({branch}) => branch === "production") ||
      branches.find(({branch}) => branch === "master") || {branch: "master"}
    ).branch;
  }
}
