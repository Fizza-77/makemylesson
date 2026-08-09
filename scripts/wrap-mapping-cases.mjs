import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../lib/stage1-curriculum-mapping.ts",
);

let s = fs.readFileSync(outPath, "utf8");
s = s.replace(
  /case '([^']+)':\n([\s\S]*?)(?=\n      case |\n    \})/g,
  (_m, id, body) => {
    const trimmed = body.replace(/\n$/, "");
    return `case '${id}': {\n${trimmed}\n      }`;
  },
);
fs.writeFileSync(outPath, s);
console.log("Wrapped switch cases");
