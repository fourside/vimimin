import { readFileSync, writeFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const manifestPath = "src/manifest.json";
const manifest = readFileSync(manifestPath, "utf8");
const updated = manifest.replace(
  /("version":\s*").*?"/,
  `$1${version}"`,
);
writeFileSync(manifestPath, updated);
