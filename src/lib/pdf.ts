export function exportToPdf(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
<style>
@page { size: A4; margin: 2cm; }
@media print {
  body { margin: 0; }
  table { page-break-inside: avoid; }
  h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
  pre, code { page-break-inside: avoid; }
}
</style>
</head>
<body>${html}</body>
</html>`);
  doc.close();

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  const cleanup = () => {
    document.body.removeChild(iframe);
  };

  // Clean up after print dialog closes (or after timeout as fallback)
  iframe.contentWindow?.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 60000);
}
