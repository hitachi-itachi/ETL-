import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { parseFileToRows, downloadRowsAsXLSX, dedupeAll } from "../controllers/dataCleanerController";

export default function DataCleaner() {
    const [rows, setRows] = useState([]);           // AOA
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleChooseFiles = () => fileInputRef.current?.click();

    async function handleFiles(files) {
        setSelectedFiles(files);
        if (!files.length) return;
        const aoa = await parseFileToRows(files[0]);
        setRows(aoa);
    }

    const handleDrop = async (e) => {
        e.preventDefault();
        await handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleFileSelect = async (e) => {
        await handleFiles(Array.from(e.target.files));
    };

    function handleClean() {
        if (!rows.length || !selectedFiles.length) return;
        const base = (selectedFiles[0].name || "data").replace(/\.(xlsx|xls|csv)$/i, "");

        // 👉 Dedup by a specific column (recommended):
        // e.g. email-only; change to [] if you truly want all columns
        const out = dedupeAll(rows, [], { caseInsensitive: true });

        console.log(`Before: ${rows.length}  After: ${out.length}`);
        downloadRowsAsXLSX(out, `${base}_deduped_by_email.xlsx`);
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                    Data Cleaning tool
                </h1>

                {/* Upload card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div
                        className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center bg-gradient-to-br from-blue-500 to-blue-600"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <button
                            onClick={handleChooseFiles}
                            className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition shadow-md inline-flex items-center"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            CHOOSE FILES
                        </button>
                        <p className="mt-3 text-white/90">or drop files here</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {selectedFiles.length > 0 && (
                            <div className="mt-6 bg-white rounded-lg p-4 shadow-inner max-w-xl mx-auto">
                                <p className="text-gray-800 text-sm font-semibold mb-1">Selected file:</p>
                                <div className="text-gray-700 text-sm truncate">
                                    {selectedFiles[0].name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {rows.length > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="inline-flex items-center gap-4 bg-white rounded-full px-5 py-3 shadow">
                            <span className="text-sm text-gray-600">Mode:</span>
                            <label className="inline-flex items-center gap-2">
                                <input type="radio" name="mode" defaultChecked readOnly />
                                <span className="text-sm text-gray-700">Remove Duplicate</span>
                            </label>
                        </div>

                        <button
                            onClick={handleClean}
                            className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold shadow hover:bg-blue-700"
                        >
                            Deduplicate & Download
                        </button>

                        <p className="text-xs text-gray-500">Rows detected: {rows.length}</p>
                    </div>
                )}
            </div>
        </div>
    );
}