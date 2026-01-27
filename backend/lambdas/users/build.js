import esbuild from "esbuild";
import { tsPathsPlugin } from "@awalgawe/esbuild-typescript-paths-plugin";
import { readdir } from "fs/promises";
import { join } from "path";

const routesPath = join(process.cwd(), "src/routes");

const listDirectories = async () => {
    const entries = await readdir(routesPath, { withFileTypes: true });
    const directories = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    return directories;
};

const build = async () => {
    const directories = await listDirectories();
    await Promise.all(
        directories.map(async (dir) => {
            try {

                await esbuild.build({
                    entryPoints: [`src/routes/${dir}/handler/index.ts`],
                    bundle: true,
                    outfile: `src/routes/${dir}/dist/index.js`,
                    platform: "node",
                    format: "cjs",
                    sourcemap: false,
                    plugins: [tsPathsPlugin()],
                    tsconfig: "./tsconfig.json",
                    absWorkingDir: process.cwd(),
                });
                console.log(`\t ${dir} built`)
            } catch(e) {
            }
        }),
    );
};

build();
