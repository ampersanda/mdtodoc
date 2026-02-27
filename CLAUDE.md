# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun dev` — start dev server
- `bun run build` — production build (static export to `out/`)
- `bun run lint` — run linting

## Architecture

Split-pane Markdown-to-Google-Docs converter. All rendering produces **inline-styled HTML** because Google Docs strips CSS classes and `<style>` blocks on paste.

**Data flow:** Markdown string → `renderMarkdown()` (custom marked renderer) → inline-styled HTML → either preview via `dangerouslySetInnerHTML` or clipboard via `copyRichHtml()` (Clipboard API with `text/html` MIME).

### Google Docs compatibility constraints

- **No `<pre>` tags** — code blocks use single-cell `<table>` with background color
- **No `border-left`** — blockquotes use two-column `<table>` (narrow colored cell + content cell)
- **Font sizes in `pt`**, not `px` — Google Docs converts px to pt incorrectly
- **Every element gets inline `style="..."`** — nothing survives paste otherwise
- **List items strip inner `<p>` tags** — otherwise bullet/number markers disappear

### Key modules

- `src/lib/styles.ts` — `TextStyle`/`StyleConfig` types, `DEFAULT_STYLES`, CSS string generators (`textStyleToCss`, `inlineCodeCss`, etc.)
- `src/lib/renderer.ts` — `renderMarkdown(markdown, styles)` — custom `marked` renderer producing inline-styled HTML
- `src/lib/clipboard.ts` — `copyRichHtml(html)` — wraps in `<html><body>`, writes via Clipboard API
- `src/hooks/useStyleConfig.ts` — React hook managing style state with `updateStyle` and `resetStyles`

### Adding new Markdown elements

Add a custom renderer method in `renderer.ts` under `marked.use({ renderer: { ... } })`. Apply styles from `styles.ts`. Test by pasting into Google Docs — many HTML elements/CSS properties are silently stripped.

## Deployment

Static export (`output: "export"` in next.config.ts). GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to GitHub Pages on push to `main`. Custom domain: `mdtodoc.ampersanda.dev`.

## Git

- Use conventional commit format: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, etc.
- Keep messages concise (1 line preferred)
- Split unrelated changes into separate commits
- NEVER include `Co-Authored-By` lines
- NEVER push to remote automatically; only push when explicitly asked
