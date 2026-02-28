import { cpSync } from "node:fs";
import * as esbuild from "esbuild";

const common = {
	bundle: true,
	sourcemap: true,
	target: "firefox115",
	format: "iife",
};

await Promise.all([
	esbuild.build({
		...common,
		entryPoints: ["src/content/index.ts"],
		outfile: "dist/content.js",
	}),
	esbuild.build({
		...common,
		entryPoints: ["src/background/index.ts"],
		outfile: "dist/background.js",
	}),
]);

cpSync("src/manifest.json", "dist/manifest.json");
cpSync("src/icons", "dist/icons", { recursive: true });

console.log("Build complete.");
