# mdtodoc

Markdown to Google Docs styled converter. Paste markdown, see a styled preview, and copy rich HTML that pastes perfectly into Google Docs.

**[Live Demo →](https://mdtodoc.ampersanda.dev)**

## Features

- Real-time split-pane editor with styled preview
- Copy button produces rich HTML that preserves formatting in Google Docs
- Customizable styles (font, size, weight, color, line height) for headings and body text
- Supports headings, lists, code blocks, blockquotes, tables, links, images, and horizontal rules

## Development

```bash
bun install
bun dev
```

## How it works

Google Docs strips CSS classes and `<style>` blocks — only inline `style="..."` attributes survive the paste. This app uses a custom [marked](https://github.com/markedjs/marked) renderer that applies inline styles to every HTML element, with font sizes in `pt` (not `px`) for correct rendering in Google Docs. Code blocks and blockquotes use table-based layouts since Google Docs doesn't support `<pre>` or `border-left`.
