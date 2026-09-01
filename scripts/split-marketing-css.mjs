import fs from "fs";
import path from "path";

const root = process.cwd();
const srcPath = path.join(root, "app/marketing-globals.css");
const src = fs.readFileSync(srcPath, "utf8").split(/\r?\n/);
const dir = path.join(root, "app/marketing");
fs.mkdirSync(dir, { recursive: true });

function write(file, start, end) {
  fs.writeFileSync(path.join(dir, file), `${src.slice(start, end).join("\n")}\n`);
}

write("marketing-base.css", 1, 143);
write("marketing-nav-core.css", 144, 665);
write("marketing-nav-lean.css", 665, 699);
write("marketing-footer.css", 700, 841);
write("marketing-mega-menus.css", 842, 1346);
write("marketing-content.css", 1346, src.length);

const globals = `@reference "tailwindcss";

@import './marketing/marketing-base.css';
@import './marketing/marketing-nav-core.css';
@import './marketing/marketing-nav-lean.css';
@import './marketing/marketing-footer.css';
@import './marketing/marketing-mega-menus.css';
@import './marketing/marketing-content.css';
`;

const lean = `@reference "tailwindcss";

@import './marketing/marketing-base.css';
@import './marketing/marketing-nav-core.css';
@import './marketing/marketing-nav-lean.css';
@import './marketing/marketing-footer.css';
@import './marketing/marketing-content.css';
@import '../marketing/styles/marketing-faq-band.css';
`;

fs.writeFileSync(srcPath, globals);
fs.writeFileSync(path.join(root, "app/marketing-lean.css"), lean);

// FAQ-only band styles for lean teaching-method / feature detail pages.
const pricing = fs.readFileSync(
  path.join(root, "marketing/styles/marketing-pricing.css"),
  "utf8",
);
const faqStart = pricing.indexOf("/* FAQ band");
const faqEnd = pricing.indexOf("/* Slide deck duration range");
const faqBand =
  faqStart >= 0 && faqEnd > faqStart
    ? `/* FAQ band styles — lean teaching-method / feature detail pages */\n\n.pricing-faq-inner {\n  width: 100%;\n  max-width: none;\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 1in;\n  padding-right: 1in;\n  box-sizing: border-box;\n}\n\n@media (max-width: 900px) {\n  .pricing-faq-inner {\n    padding-left: max(1rem, 0.5in);\n    padding-right: max(1rem, 0.5in);\n  }\n}\n\n@media (max-width: 640px) {\n  .pricing-faq-inner {\n    padding-left: 1rem;\n    padding-right: 1rem;\n  }\n}\n\n${pricing.slice(faqStart, faqEnd).trim()}\n`
    : "";

fs.writeFileSync(path.join(root, "marketing/styles/marketing-faq-band.css"), faqBand);

console.log(`Split ${src.length} lines into app/marketing/* partials.`);
