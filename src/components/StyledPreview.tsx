"use client";

import { useEffect, useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/renderer";
import { initHighlighter } from "@/lib/highlight";
import type { StyleConfig } from "@/lib/styles";

interface StyledPreviewProps {
  markdown: string;
  styles: StyleConfig;
}

export default function StyledPreview({
  markdown,
  styles,
}: StyledPreviewProps) {
  const [highlighterReady, setHighlighterReady] = useState(false);

  useEffect(() => {
    initHighlighter().then(() => setHighlighterReady(true));
  }, []);

  const html = useMemo(
    () => (markdown ? renderMarkdown(markdown, styles) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markdown, styles, highlighterReady]
  );

  return (
    <div
      role="region"
      aria-label="Rendered preview"
      aria-live="polite"
      aria-atomic={false}
      tabIndex={0}
      className="h-full overflow-auto bg-white p-6 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
