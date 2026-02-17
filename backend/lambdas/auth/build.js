import esbuild from "esbuild";
import { tsPathsPlugin } from "@awalgawe/esbuild-typescript-paths-plugin";
import { readdir, cp } from "fs/promises";
import { join } from "path";

const routesPath = join(process.cwd(), "src/routes");
const assetsPath = join(process.cwd(), "src/assets");

const listDirectories = async () => {
    const entries = await readdir(routesPath, { withFileTypes: true });
    return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
};

const build = async () => {
    const directories = await listDirectories();

    for (const dir of directories) {
        try {
            const outDir = `src/routes/${dir}/dist`;

            await esbuild.build({
                entryPoints: [`src/routes/${dir}/handler/index.ts`],
                bundle: true,
                outfile: `${outDir}/index.js`,
                platform: "node",
                format: "cjs",
                sourcemap: false,
                plugins: [tsPathsPlugin()],
                tsconfig: "./tsconfig.json",
                absWorkingDir: process.cwd(),
            });

            // ✅ copie des assets
            await cp(assetsPath, join(process.cwd(), outDir, "assets"), {
                recursive: true,
            });

            console.log(`\t ${dir} built + assets copied`);
        } catch (e) {
            console.error(`Build failed for ${dir}`, e);
        }
    }
};

build();
