import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const required = ["index.html", "styles.css", "app.js", "assets/CormorantGaramond-Medium.ttf"];
const missing = required.filter((file) => !existsSync(resolve(dist, file)));
if (missing.length) {
  console.error(`Missing build files: ${missing.join(", ")}`);
  process.exit(1);
}
for (const file of required) {
  if (statSync(resolve(dist, file)).size === 0) {
    console.error(`Empty build file: ${file}`);
    process.exit(1);
  }
}
console.log(`Static build verified: ${dist}`);
