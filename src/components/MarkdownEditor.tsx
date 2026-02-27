"use client";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <label htmlFor="markdown-editor" className="sr-only">
        Markdown input
      </label>
      <textarea
        id="markdown-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        spellCheck={false}
        aria-describedby="editor-hint"
        className="h-full w-full resize-none border-0 bg-white p-6 font-mono text-sm leading-relaxed text-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 placeholder:text-gray-400"
      />
      <span id="editor-hint" className="sr-only">
        Write markdown syntax in this editor. The preview will update in real
        time on the right.
      </span>
    </div>
  );
}
