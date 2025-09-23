// src/components/ExportPDF.jsx
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { generateFinancialPDF } from '../utilities/pdfGenerator';

const ExportPDF = ({ financialData, categories, recentTransactions }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [toast, setToast] = useState("");

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await generateFinancialPDF(financialData, categories, recentTransactions);
            if (result.success) {
                setToast(`PDF exported successfully: ${result.filename}`);
            } else {
                setToast('Failed to export PDF. Please try again.');
            }
        } catch (error) {
            setToast('An error occurred while exporting. Please try again.');
        } finally {
            setIsExporting(false);
            // Auto-dismiss toast after 3 seconds
            setTimeout(() => setToast("") , 3000);
        }
    };

    return (
        <div className="relative">
            {/* Toast message */}
            {toast && (
                <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast}
                </div>
            )}
            <button
                onClick={handleExport}
                disabled={isExporting}
                className={`
                    flex items-center px-4 py-2 rounded-lg transition-all cursor-pointer
                    ${isExporting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }
                `}
                title={isExporting ? 'Generating PDF...' : 'Export Dashboard to PDF'}
            >
                <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
                {isExporting && <span className="ml-2 text-sm">Exporting...</span>}
            </button>
        </div>
    );
};

export default ExportPDF;