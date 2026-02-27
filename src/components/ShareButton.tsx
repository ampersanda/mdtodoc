"use client";

import { useState, useCallback } from "react";
import { IoShareOutline, IoCheckmarkOutline } from "react-icons/io5";
import { id } from "@instantdb/react";
import db from "@/lib/instant";

interface ShareButtonProps {
  markdown: string;
}

export default function ShareButton({ markdown }: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!markdown.trim() || sharing) return;

    setSharing(true);
    try {
      const docId = id();
      await db.transact(
        db.tx.documents[docId].update({
          markdown,
          createdAt: Date.now(),
        })
      );
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?id=${docId}`
      );
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } finally {
      setSharing(false);
    }
  }, [markdown, sharing]);

  const isEmpty = !markdown.trim();

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isEmpty || sharing}
        aria-disabled={isEmpty || sharing}
        aria-label={
          isEmpty ? "Share (enter markdown first)" : "Share markdown"
        }
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-4 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {shared ? (
          <>
            <IoCheckmarkOutline className="size-4" aria-hidden="true" />
            Link copied!
          </>
        ) : (
          <>
            <IoShareOutline className="size-4" aria-hidden="true" />
            Share
          </>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {shared ? "Share link copied to clipboard" : ""}
      </span>
    </>
  );
}
