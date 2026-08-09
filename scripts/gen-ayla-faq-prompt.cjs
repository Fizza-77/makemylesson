const fs = require("fs");
const t = fs.readFileSync("data/ayla_faq.txt", "utf8");
const out =
  "/** Master FAQ text for Ayla systemInstruction (Flutter assets/data/ayla_faq.txt). */\n" +
  "export const AYLA_FAQ_PROMPT_TEXT = " +
  JSON.stringify(t) +
  ";\n";
fs.writeFileSync("data/ayla-faq-prompt.ts", out, "utf8");
console.log("wrote", out.length, "chars");
