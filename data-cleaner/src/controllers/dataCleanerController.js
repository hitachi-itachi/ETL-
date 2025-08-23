import * as XLSX from "xlsx";
import * as dfd from "danfojs";

// CSV -> readAsText, Excel -> readAsArrayBuffer
export async function parseFileToRows(file) {
  const isCSV = /\.csv$/i.test(file.name);
  const data = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    isCSV ? r.readAsText(file) : r.readAsArrayBuffer(file);
  });

  const wb = isCSV ? XLSX.read(data, { type: "string" })
    : XLSX.read(new Uint8Array(data), { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }); // AOA
}

export function downloadRowsAsXLSX(rows, filename = "data.xlsx") {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Cleaned");
  XLSX.writeFile(wb, filename);
}

// AOA -> AOA; keyNames=[] => dedupe across ALL columns
export function dedupeDanfo(rows, keyNames = []) {
  if (!rows?.length) return rows;
  const [header, ...body] = rows;
  const df = new dfd.DataFrame(body, { columns: header });
  const out = keyNames.length ? df.dropDuplicates({ columns: keyNames })
    : df.dropDuplicates();
  const aoo = out.toJSON();
  return [header, ...aoo.map(o => header.map(h => o[h] ?? ""))];
}

// keep your parseFileToRows + downloadRowsAsXLSX as-is

function norm(v, lower = true) {
  let s = v == null ? "" : String(v);
  s = s.replace(/\u00A0/g, " ").trim(); //basically remove whitespace
  return lower ? s.toLowerCase() : s;
}

/** AOA -> AOA; keyNames = [] => all columns */
export function dedupeAll(rows, keyNames = [], { caseInsensitive = true } = {}) {
  if (!rows?.length) return rows;
  const [header, ...body] = rows;

  // map column names -> indexes
  const idxs = keyNames.length
    ? keyNames.map(n => header.indexOf(n)).filter(i => i >= 0)
    : null;

  const seen = new Set();
  const out = [];
  for (const r of body) {
    const vals = (idxs ? idxs.map(i => r[i]) : r).map(v => norm(v, caseInsensitive));
    const key = JSON.stringify(vals);
    if (!seen.has(key)) { seen.add(key); out.push(r); }
  }
  return [header, ...out];
}