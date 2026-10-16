export function exportCSV(rows, filename) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]),
    quote = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
  const blob = new Blob(
    [
      [
        keys.map(quote).join(","),
        ...rows.map((row) => keys.map((k) => quote(row[k])).join(",")),
      ].join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
