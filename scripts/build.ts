import { $, type BuildConfig, build } from "bun";

const config: BuildConfig = {
  entrypoints: [
    "./src/content/index.ts",
    "./src/options/index.tsx",
    "./src/background/index.ts",
  ],
  outdir: "./out",
  root: "./src",
  naming: "[dir].[ext]",
  target: "browser",
  minify: true,
  sourcemap: "none",
  splitting: false,
  format: "esm"
}

const clean = async () => {
  try {
    await $`rm -rf ./out`;
    console.log("Clean is successful.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const buildScript = async () => {
  try {
    await build(config);
    console.log("Build is successful.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const buildTailwind = async () => {
  try {
    await $`bun tailwind -i ./src/index.css -o ./out/index.css --minify`
    console.log("Build Tailwind is successful.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const copy = async () => {
  try {
    await $`cp ./src/manifest.json ./out/manifest.json`;
    await $`cp ./src/options/index.html ./out/options.html`;
    console.log("Copied files");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

await clean();
await buildScript();
await buildTailwind();
await copy();
