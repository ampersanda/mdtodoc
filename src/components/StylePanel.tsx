"use client";

import { useState, useCallback, useEffect, useRef, useId } from "react";
import {
  IoSettingsOutline,
  IoRefreshOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import type { StyleConfig, StyleTarget, TextStyle } from "@/lib/styles";

const TARGETS: { key: StyleTarget; label: string }[] = [
  { key: "h1", label: "Heading 1" },
  { key: "h2", label: "Heading 2" },
  { key: "h3", label: "Heading 3" },
  { key: "h4", label: "Heading 4" },
  { key: "h5", label: "Heading 5" },
  { key: "h6", label: "Heading 6" },
  { key: "paragraph", label: "Body Text" },
];

const FONT_FAMILIES = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Helvetica",
  "Courier New",
  "Roboto",
];

const FONT_WEIGHTS = ["normal", "bold"];

interface StylePanelProps {
  styles: StyleConfig;
  onUpdateStyle: (
    target: StyleTarget,
    property: keyof TextStyle,
    value: string
  ) => void;
  onReset: () => void;
}

export default function StylePanel({
  styles,
  onUpdateStyle,
  onReset,
}: StylePanelProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<StyleTarget | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    },
    [open]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Focus the panel heading when opened
  useEffect(() => {
    if (open && panelRef.current) {
      const heading = panelRef.current.querySelector<HTMLElement>(
        "[data-panel-heading]"
      );
      heading?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close style settings" : "Open style settings"}
        className="absolute top-2 right-2 z-10 cursor-pointer rounded-md bg-gray-100 p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <IoSettingsOutline className="size-[18px]" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label="Style settings"
          className="absolute top-12 right-2 z-10 w-72 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2
              data-panel-heading
              tabIndex={-1}
              className="text-sm font-semibold text-gray-700 outline-none"
            >
              Styles
            </h2>
            <button
              onClick={onReset}
              className="flex cursor-pointer items-center gap-1 text-xs text-blue-600 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded-sm"
            >
              <IoRefreshOutline className="size-3.5" aria-hidden="true" />
              Reset to Defaults
            </button>
          </div>

          <div
            className="max-h-80 overflow-y-auto"
            tabIndex={0}
            role="group"
            aria-label="Style targets"
          >
            {TARGETS.map(({ key, label }) => {
              const isExpanded = expanded === key;
              const sectionId = `${panelId}-${key}`;
              return (
                <fieldset
                  key={key}
                  className="border-b border-gray-50 last:border-b-0"
                >
                  <legend className="sr-only">{label} styles</legend>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : key)}
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                  >
                    <span>{label}</span>
                    <IoChevronDownOutline
                      className={`size-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={sectionId}
                    role="group"
                    aria-label={`${label} style options`}
                    hidden={!isExpanded}
                    className="space-y-3 bg-gray-50/50 px-4 py-3"
                  >
                    {isExpanded && (
                      <>
                        <StyleField
                          label="Font"
                          targetLabel={label}
                          type="select"
                          options={FONT_FAMILIES}
                          value={styles[key].fontFamily}
                          onChange={(v) =>
                            onUpdateStyle(key, "fontFamily", v)
                          }
                        />
                        <StyleField
                          label="Size"
                          targetLabel={label}
                          type="text"
                          value={styles[key].fontSize}
                          onChange={(v) =>
                            onUpdateStyle(key, "fontSize", v)
                          }
                        />
                        <StyleField
                          label="Weight"
                          targetLabel={label}
                          type="select"
                          options={FONT_WEIGHTS}
                          value={styles[key].fontWeight}
                          onChange={(v) =>
                            onUpdateStyle(key, "fontWeight", v)
                          }
                        />
                        <StyleField
                          label="Color"
                          targetLabel={label}
                          type="color"
                          value={styles[key].color}
                          onChange={(v) =>
                            onUpdateStyle(key, "color", v)
                          }
                        />
                        <StyleField
                          label="Line Height"
                          targetLabel={label}
                          type="text"
                          value={styles[key].lineHeight}
                          onChange={(v) =>
                            onUpdateStyle(key, "lineHeight", v)
                          }
                        />
                      </>
                    )}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function StyleField({
  label,
  targetLabel,
  type,
  value,
  options,
  onChange,
}: {
  label: string;
  targetLabel: string;
  type: "select" | "text" | "color";
  value: string;
  options?: string[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const fullLabel = `${targetLabel} ${label}`;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="w-16 shrink-0 text-xs text-gray-500"
      >
        {label}
      </label>
      {type === "select" && options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={fullLabel}
          className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${fullLabel} picker`}
            className="h-6 w-6 cursor-pointer rounded border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${fullLabel} hex value`}
            className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </div>
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={fullLabel}
          className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      )}
    </div>
  );
}
