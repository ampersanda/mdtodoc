"use client";

import { useState, useCallback } from "react";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";
import { copyRichHtml } from "@/lib/clipboard";
import { renderMarkdown } from "@/lib/renderer";
import type { StyleConfig } from "@/lib/styles";

interface CopyButtonProps {
  markdown: string;
  styles: StyleConfig;
}

export default function CopyButton({ markdown, styles }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) return;
    const html = renderMarkdown(markdown, styles);
    await copyRichHtml(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown, styles]);

  const isEmpty = !markdown.trim();

  return (
    <>
      <button
        onClick={handleCopy}
        disabled={isEmpty}
        aria-disabled={isEmpty}
        aria-label={
          isEmpty
            ? "Copy for Google Docs (enter markdown first)"
            : "Copy for Google Docs"
        }
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/15 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? (
          <>
            <IoCheckmarkOutline className="size-4" aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <IoCopyOutline className="size-4" aria-hidden="true" />
            Copy for Google Docs
          </>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
