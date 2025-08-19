import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Monitor, Smartphone, Download } from 'lucide-react';

export default function WordToPdfConverter() {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleChooseFiles = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
                    Data Cleaning tool
                </h1>

                {/* Main Upload Area */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div
                        className={`border-2 border-dashed rounded-lg p-16 text-center transition-all duration-300 ${dragOver
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-blue-300 bg-gradient-to-br from-blue-500 to-blue-600'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >

                        {/* Choose Files Button */}
                        <div className="mb-4">
                            <button
                                onClick={handleChooseFiles}
                                className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-md flex items-center justify-center mx-auto"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                CHOOSE FILES
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Drop Text */}
                        <p className="text-white text-lg">or drop files here</p>

                        {/* Selected Files Display */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
                                <p className="text-black font-semibold mb-2">Selected Files:</p>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="text-black text-sm">
                                        {file.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Description */}
                    <div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Effortlessly convert Word documents to PDF files for free, without watermarks or the need to sign up.
                        </p>
                    </div>

                    {/* Right Column - Features */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">Trusted by 1.7 billion users since 2013</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">Easy-to-use online Word to PDF converter</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700">Compatible with</span>
                                <Monitor className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">Mac,</span>
                                <Monitor className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">Windows,</span>
                                <Smartphone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">iOS, and Android</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Convert Button */}
                {selectedFiles.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                            Convert to PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}