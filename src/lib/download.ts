// Browser-only: hands a file to the visitor's downloads.
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Phones can take a while to start a download, so the link stays valid for a minute.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
