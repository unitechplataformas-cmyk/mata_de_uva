import { cpSync, copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

// Keep the deployable directory in sync with the source files. Cloudflare Pages
// publishes `dist`, so validating an old hand-copied directory can otherwise
// deploy stale HTML, CSS, JavaScript, or media while local development is current.
mkdirSync(dist, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js"]) {
  copyFileSync(resolve(root, file), resolve(dist, file));
}
cpSync(resolve(root, "assets"), resolve(dist, "assets"), { recursive: true });
cpSync(resolve(root, "eventos"), resolve(dist, "eventos"), { recursive: true });
cpSync(resolve(root, "el-vinedo"), resolve(dist, "el-vinedo"), { recursive: true });

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
