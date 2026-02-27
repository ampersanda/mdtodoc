"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoRefreshOutline } from "react-icons/io5";
import { useStyleConfig } from "@/hooks/useStyleConfig";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import db from "@/lib/instant";
import MarkdownEditor from "@/components/MarkdownEditor";
import StyledPreview from "@/components/StyledPreview";
import CopyButton from "@/components/CopyButton";
import ExportPdfButton from "@/components/ExportPdfButton";
import ShareButton from "@/components/ShareButton";
import StylePanel from "@/components/StylePanel";

const SAMPLE_MARKDOWN = `# Welcome to mdtodoc

This tool converts **markdown** into styled HTML that pastes perfectly into **Google Docs**.

## How to use

1. Write or paste your markdown on the left
2. See the styled preview on the right
3. Click **Copy for Google Docs** and paste into your document

## Features

- **Headings** — H1 through H6 with customizable styles
- **Bold** and *italic* text
- [Links](https://example.com) with proper styling
- Code blocks and \`inline code\`
- Blockquotes
- Tables
- Horizontal rules

### Code Examples

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

\`\`\`clojure
(defn greet [name]
  (str "Hello, " name "!"))

(defn factorial [n]
  (reduce * (range 1 (inc n))))
\`\`\`

### Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

### Table

| Feature | Status |
|---------|--------|
| Headings | Done |
| Lists | Done |
| Code blocks | Done |
| Tables | Done |

---

*Customize styles using the gear icon on the preview panel.*
`;

const STORAGE_KEY = "mdtodoc-markdown";

export default function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const { status: saveStatus, trigger: triggerSave } = useSaveStatus();
  const { styles, updateStyle, resetStyles } = useStyleConfig(triggerSave);
  const initialLoadRef = useRef(true);
  const searchParams = useSearchParams();
  const shareId = searchParams.get("id");

  const { data: shareData, isLoading: shareLoading } = db.useQuery(
    shareId ? { documents: { $: { where: { id: shareId } } } } : null
  );

  useEffect(() => {
    if (shareData?.documents?.[0]) {
      setMarkdown(shareData.documents[0].markdown);
      initialLoadRef.current = false;
    }
  }, [shareData]);

  useEffect(() => {
    if (shareId) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setMarkdown(saved);
    initialLoadRef.current = false;
  }, [shareId]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    localStorage.setItem(STORAGE_KEY, markdown);
    if (shareId) {
      db.transact(db.tx.documents[shareId].update({ markdown }));
    }
    triggerSave();
  }, [markdown, shareId, triggerSave]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <a
        href="#markdown-editor"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-800 focus:shadow-md"
      >
        Skip to editor
      </a>

      <header className="flex shrink-0 items-center justify-between bg-gray-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">
            mdtodoc
            <span className="ml-2 text-xs font-normal text-gray-400">
              v{process.env.APP_VERSION}
            </span>
          </h1>
          {saveStatus !== "idle" && (
            <span className="text-xs text-gray-400">
              {saveStatus === "saving" ? "Saving..." : "Saved"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Reset editor to the example? Your current content will be lost."
                )
              ) {
                setMarkdown(SAMPLE_MARKDOWN);
              }
            }}
            disabled={markdown === SAMPLE_MARKDOWN}
            aria-disabled={markdown === SAMPLE_MARKDOWN}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-4 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IoRefreshOutline className="size-4" aria-hidden="true" />
            Reset to example
          </button>
          <ExportPdfButton markdown={markdown} styles={styles} />
          <ShareButton markdown={markdown} />
          <CopyButton markdown={markdown} styles={styles} />
        </div>
      </header>

      <main className="flex min-h-0 flex-1">
        <section
          className="relative w-1/2 border-r border-gray-200"
          aria-label="Markdown editor"
        >
          {shareLoading && (
            <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-gray-800/80 px-3 py-1.5 text-xs text-gray-200 shadow-sm backdrop-blur-sm">
              <svg
                className="size-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading shared document...
            </div>
          )}
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </section>

        <section className="relative w-1/2" aria-label="Styled preview">
          <StylePanel
            styles={styles}
            onUpdateStyle={updateStyle}
            onReset={resetStyles}
          />
          <StyledPreview markdown={markdown} styles={styles} />
        </section>
      </main>
    </div>
  );
}
