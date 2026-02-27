"use client";

import { useCallback } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { exportToPdf } from "@/lib/pdf";
import { renderMarkdown } from "@/lib/renderer";
import type { StyleConfig } from "@/lib/styles";

interface ExportPdfButtonProps {
  markdown: string;
  styles: StyleConfig;
}

export default function ExportPdfButton({
  markdown,
  styles,
}: ExportPdfButtonProps) {
  const handleExport = useCallback(() => {
    if (!markdown.trim()) return;
    const html = renderMarkdown(markdown, styles);
    exportToPdf(html);
  }, [markdown, styles]);

  const isEmpty = !markdown.trim();

  return (
    <button
      onClick={handleExport}
      disabled={isEmpty}
      aria-disabled={isEmpty}
      aria-label={
        isEmpty ? "Export to PDF (enter markdown first)" : "Export to PDF"
      }
      className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-4 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <IoDownloadOutline className="size-4" aria-hidden="true" />
      Export PDF
    </button>
  );
}
