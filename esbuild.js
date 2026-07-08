const esbuild = require("esbuild");

const args = process.argv.slice(2);
const watch = args.includes("--watch");

// Node.js Extension Bundle
const extensionOptions = {
  entryPoints: ["./src/extension.ts"],
  bundle: true,
  outfile: "./dist/extension.js",
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  sourcemap: true,
  minify: !watch,
  logLevel: "info",
};

// Webview UI Client Bundle (Browser)
const explorerOptions = {
  entryPoints: ["./src/explorer/media/main.ts"],
  bundle: true,
  outfile: "./dist/explorer/main.js",
  format: "iife",
  platform: "browser",
  sourcemap: true,
  minify: !watch,
  logLevel: "info",
};

async function main() {
  if (watch) {
    const extCtx = await esbuild.context(extensionOptions);
    await extCtx.watch();

    const expCtx = await esbuild.context(explorerOptions);
    await expCtx.watch();

    console.log("Watching for changes...");
  } else {
    await esbuild.build(extensionOptions);
    await esbuild.build(explorerOptions);
    console.log("Build complete.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
