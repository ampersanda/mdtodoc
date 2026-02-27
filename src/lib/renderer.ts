import { Marked, type Tokens } from "marked";
import {
  type StyleConfig,
  type StyleTarget,
  textStyleToCss,
  inlineCodeCss,
  linkCss,
  hrCss,
  tableCss,
  thCss,
  tdCss,
} from "./styles";
import { highlightCode } from "./highlight";

export function renderMarkdown(markdown: string, styles: StyleConfig): string {
  const marked = new Marked();

  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading): string {
        const text = this.parser.parseInline(tokens);
        const target = `h${depth}` as StyleTarget;
        const style = styles[target];
        return `<h${depth} style="${textStyleToCss(style)}; margin: 0.8em 0 0.4em 0">${text}</h${depth}>`;
      },

      paragraph({ tokens }: Tokens.Paragraph): string {
        const text = this.parser.parseInline(tokens);
        return `<p style="${textStyleToCss(styles.paragraph)}; margin: 0.5em 0">${text}</p>`;
      },

      list({ ordered, items }: Tokens.List): string {
        const tag = ordered ? "ol" : "ul";
        const listType = ordered
          ? "list-style-type: decimal"
          : "list-style-type: disc";
        const body = items
          .map((item) => {
            // Parse tokens but strip wrapping <p> tags so list markers show
            const content = this.parser.parse(item.tokens);
            const stripped = content.replace(
              /^<p style="[^"]*">([\s\S]*?)<\/p>$/,
              "$1"
            );
            return `<li style="${textStyleToCss(styles.paragraph)}; display: list-item; margin: 0.25em 0">${stripped}</li>`;
          })
          .join("");
        const listStyle = [
          `font-family: ${styles.paragraph.fontFamily}, sans-serif`,
          `font-size: ${styles.paragraph.fontSize}`,
          `color: ${styles.paragraph.color}`,
          `line-height: ${styles.paragraph.lineHeight}`,
          listType,
          "margin: 0.5em 0",
          "padding-left: 2em",
        ].join("; ");
        return `<${tag} style="${listStyle}">${body}</${tag}>`;
      },

      // Google Docs strips <pre> — use a single-cell table instead
      code({ text, lang }: Tokens.Code): string {
        const highlighted = highlightCode(text, lang || "");
        const langLabel = lang
          ? `<div style="font-family: Arial, sans-serif; font-size: 7pt; color: #999999; margin-bottom: 4px">${lang}</div>`
          : "";
        const codeStyle = [
          "font-family: Consolas, Monaco, 'Courier New', monospace",
          "font-size: 9pt",
          "color: #333333",
          "line-height: 1.2",
          "white-space: pre-wrap",
          "display: block",
        ].join("; ");
        return `<table style="border-collapse: collapse; margin: 1em 0; width: 100%"><tr><td style="background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; padding: 12px">${langLabel}<code style="${codeStyle}">${highlighted}</code></td></tr></table>`;
      },

      codespan({ text }: Tokens.Codespan): string {
        return `<code style="${inlineCodeCss()}">${text}</code>`;
      },

      // Google Docs strips border-left — use a two-column table instead
      blockquote({ tokens }: Tokens.Blockquote): string {
        const body = this.parser.parse(tokens);
        return `<table style="border-collapse: collapse; margin: 1em 0; width: 100%"><tr><td style="width: 4px; background-color: #cccccc; padding: 0"></td><td style="padding: 8px 16px; font-family: ${styles.paragraph.fontFamily}, sans-serif; font-size: ${styles.paragraph.fontSize}; color: #666666; line-height: ${styles.paragraph.lineHeight}">${body}</td></tr></table>`;
      },

      link({ tokens, href }: Tokens.Link): string {
        const text = this.parser.parseInline(tokens);
        return `<a href="${href}" style="${linkCss(styles.paragraph)}">${text}</a>`;
      },

      strong({ tokens }: Tokens.Strong): string {
        const text = this.parser.parseInline(tokens);
        return `<strong style="font-weight: bold">${text}</strong>`;
      },

      em({ tokens }: Tokens.Em): string {
        const text = this.parser.parseInline(tokens);
        return `<em style="font-style: italic">${text}</em>`;
      },

      hr(): string {
        return `<hr style="${hrCss()}" />`;
      },

      table({ header, rows }: Tokens.Table): string {
        const headerHtml = header
          .map(
            (cell) =>
              `<th style="${thCss(styles.paragraph)}">${this.parser.parseInline(cell.tokens)}</th>`
          )
          .join("");
        const rowsHtml = rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td style="${tdCss(styles.paragraph)}">${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`
          )
          .join("");
        return `<table style="${tableCss()}"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
      },

      image({ href, title, text }: Tokens.Image): string {
        const titleAttr = title ? ` title="${title}"` : "";
        return `<img src="${href}" alt="${text}"${titleAttr} style="max-width: 100%; height: auto; margin: 0.5em 0" />`;
      },
    },
  });

  return marked.parse(markdown) as string;
}
