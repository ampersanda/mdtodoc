export async function copyRichHtml(html: string): Promise<void> {
  const wrapped = `<html><body>${html}</body></html>`;
  const blob = new Blob([wrapped], { type: "text/html" });
  const item = new ClipboardItem({ "text/html": blob });
  await navigator.clipboard.write([item]);
}
