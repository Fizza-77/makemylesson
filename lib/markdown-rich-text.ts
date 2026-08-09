/**
 * Lightweight markdown ↔ HTML helpers for the lesson-plan WYSIWYG editor.
 * Covers the subset Stage 1 plans typically use (headings, bold, italic, lists).
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__(.+?)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

/** Convert stored markdown into HTML for contentEditable. */
export function markdownToEditableHtml(markdown: string): string {
  const src = markdown.replace(/\r\n/g, "\n").trim();
  if (!src) return "<p><br></p>";

  const lines = src.split("\n");
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = Math.min(heading[1].length, 6);
      blocks.push(`<h${level}>${inlineMarkdownToHtml(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemLine = (lines[i] ?? "").trim();
        const m = /^[-*+]\s+(.*)$/.exec(itemLine);
        if (!m) break;
        items.push(`<li>${inlineMarkdownToHtml(m[1])}</li>`);
        i += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemLine = (lines[i] ?? "").trim();
        const m = /^(\d+)\.\s+(.*)$/.exec(itemLine);
        if (!m) break;
        items.push(`<li>${inlineMarkdownToHtml(m[2])}</li>`);
        i += 1;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const para: string[] = [trimmed];
    i += 1;
    while (i < lines.length) {
      const next = (lines[i] ?? "").trim();
      if (
        !next ||
        /^#{1,6}\s+/.test(next) ||
        /^[-*+]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      para.push(next);
      i += 1;
    }
    blocks.push(`<p>${para.map(inlineMarkdownToHtml).join("<br>")}</p>`);
  }

  return blocks.join("") || "<p><br></p>";
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function inlineHtmlToMarkdown(html: string): string {
  let out = html;
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<\/?(?:span|font)[^>]*>/gi, "");
  out = out.replace(/<(strong|b)(?:\s[^>]*)?>/gi, "**");
  out = out.replace(/<\/(strong|b)>/gi, "**");
  out = out.replace(/<(em|i)(?:\s[^>]*)?>/gi, "*");
  out = out.replace(/<\/(em|i)>/gi, "*");
  out = out.replace(/<code(?:\s[^>]*)?>/gi, "`");
  out = out.replace(/<\/code>/gi, "`");
  out = out.replace(/<[^>]+>/g, "");
  return decodeEntities(out).replace(/\u00a0/g, " ");
}

function listItemsToMarkdown(listHtml: string, ordered: boolean): string {
  const items = [...listHtml.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi)];
  return items
    .map((m, idx) => {
      const body = inlineHtmlToMarkdown(m[1] ?? "")
        .replace(/\n+/g, " ")
        .trim();
      return ordered ? `${idx + 1}. ${body}` : `- ${body}`;
    })
    .join("\n");
}

/** Convert contentEditable HTML back to markdown for storage / preview. */
export function editableHtmlToMarkdown(html: string): string {
  let src = html
    .replace(/\r\n/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<div(?:\s[^>]*)?>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>");

  const blocks: string[] = [];

  const blockRe =
    /<(h[1-6]|p|ul|ol)(?:\s[^>]*)?>([\s\S]*?)<\/\1>|<br\s*\/?>/gi;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = blockRe.exec(src)) !== null) {
    const gap = src.slice(lastIndex, match.index).trim();
    if (gap) {
      const plain = inlineHtmlToMarkdown(gap).trim();
      if (plain) blocks.push(plain);
    }
    lastIndex = match.index + match[0].length;

    if (/^<br/i.test(match[0])) {
      continue;
    }

    const tag = (match[1] ?? "").toLowerCase();
    const inner = match[2] ?? "";

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      const text = inlineHtmlToMarkdown(inner).replace(/\n+/g, " ").trim();
      if (text) blocks.push(`${"#".repeat(level)} ${text}`);
      continue;
    }

    if (tag === "ul") {
      const list = listItemsToMarkdown(inner, false);
      if (list) blocks.push(list);
      continue;
    }

    if (tag === "ol") {
      const list = listItemsToMarkdown(inner, true);
      if (list) blocks.push(list);
      continue;
    }

    if (tag === "p") {
      const text = inlineHtmlToMarkdown(inner).trim();
      if (text) blocks.push(text);
    }
  }

  const trailing = src.slice(lastIndex).trim();
  if (trailing) {
    const plain = inlineHtmlToMarkdown(trailing).trim();
    if (plain) blocks.push(plain);
  }

  if (blocks.length === 0) {
    const fallback = inlineHtmlToMarkdown(src).trim();
    return fallback;
  }

  return blocks.join("\n\n").trim();
}
