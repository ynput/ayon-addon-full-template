type Cell = string | number | null | undefined;

const csvCell = (value: Cell) => {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Saves the rows as a CSV file through the browser's download. */
export const downloadCsv = (fileName: string, rows: Cell[][]) => {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

/** Tab separated, so it pastes into the cells of a spreadsheet. */
export const toTsv = (rows: Cell[][]) =>
  rows.map((row) => row.map((value) => (value == null ? "" : String(value))).join("\t")).join("\n");
