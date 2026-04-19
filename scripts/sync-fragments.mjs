/**
 * Copies components/navbar.html and components/footer.html into js/main.js
 * as EMBEDDED_* strings (for file:// fallback). Run after editing those HTML files.
 *
 * Usage (from color-learning-website folder):
 *   node scripts/sync-fragments.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var root = path.join(__dirname, "..");
var mainPath = path.join(root, "js", "main.js");

var navbarPath = path.join(root, "components", "navbar.html");
var footerPath = path.join(root, "components", "footer.html");

var navbar = fs.readFileSync(navbarPath, "utf8").trim();
var footer = fs.readFileSync(footerPath, "utf8").trim();

var block =
  "  // --- BEGIN AUTO-GENERATED (node scripts/sync-fragments.mjs) ---\n" +
  "  var EMBEDDED_NAVBAR = " +
  JSON.stringify(navbar) +
  ";\n" +
  "  var EMBEDDED_FOOTER = " +
  JSON.stringify(footer) +
  ";\n" +
  "  // --- END AUTO-GENERATED ---";

var main = fs.readFileSync(mainPath, "utf8");
var re = /\s*\/\/ --- BEGIN AUTO-GENERATED[\s\S]*?\/\/ --- END AUTO-GENERATED ---/;

if (!re.test(main)) {
  console.error("sync-fragments.mjs: markers not found in js/main.js");
  process.exit(1);
}

main = main.replace(re, "\n" + block + "\n");
fs.writeFileSync(mainPath, main, "utf8");
console.log("Embedded navbar + footer synced from components/ → js/main.js");
