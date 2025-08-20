import * as XLSX from "xlsx";

/** Parse A CSV/Excel File -> {rows, columns} */
export function parseFileToRows(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            resolve(rows);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

/** Remove duplicates by keys(all Columns if keys empty) */
export function removeDuplicates(data, keys = []) {
    const seen = new Set();
    const uniqueRows = [];

    data.forEach(row => {
        const key = keys.length ? keys.map(k => row[k]).join("|") : row.join("|");
        if (!seen.has(key)) {
            seen.add(key);
            uniqueRows.push(row);
        }
    });

    return uniqueRows;
}
/**Download rows as XLSX(Single Sheet) */
export function downloadRowsAsXLSX(rows, filename = "data.xlsx") {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
}


