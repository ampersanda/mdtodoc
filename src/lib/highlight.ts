import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;
let initPromise: Promise<void> | null = null;

export function initHighlighter(): Promise<void> {
  if (!initPromise) {
    initPromise = createHighlighter({
      themes: ["github-light"],
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "python",
        "html",
        "css",
        "json",
        "bash",
        "shell",
        "go",
        "rust",
        "java",
        "c",
        "cpp",
        "sql",
        "yaml",
        "xml",
        "markdown",
        "diff",
        "ruby",
        "php",
        "swift",
        "kotlin",
        "toml",
        "dockerfile",
        "clojure",
      ],
    })
      .then((h) => {
        highlighter = h;
      })
      .catch(() => {
        initPromise = null;
      });
  }
  return initPromise;
}

export function highlightCode(code: string, lang: string): string {
  if (!highlighter || !lang) return escapeHtml(code);

  try {
    const html = highlighter.codeToHtml(code, {
      lang,
      theme: "github-light",
    });

    // Strip shiki's <pre><code> wrappers — we use our own table wrapper
    return html
      .replace(/^<pre[^>]*><code[^>]*>/, "")
      .replace(/<\/code><\/pre>$/, "");
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
