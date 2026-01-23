// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';

export const generateFinancialPDF = async (financialData, categories) => {
    try {
        // Create new PDF document (portrait, millimeters, A4 size)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth(); // ~210mm for A4
        const pageHeight = pdf.internal.pageSize.getHeight(); // ~297mm for A4
        
        // --- HEADER SECTION ---
        // Set title styling and add main title
        pdf.setFontSize(24);
        pdf.setTextColor(37, 99, 235); // Blue color
        pdf.text('Financial Dashboard Report', 20, 25);
        
        // Add generation date with smaller font
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100); // Gray color
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        pdf.text(`Generated on: ${currentDate}`, 20, 35);
        
        // Add a horizontal line under header
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, 40, pageWidth - 20, 40);
        
        // --- FINANCIAL SUMMARY SECTION ---
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0); // Black
        pdf.text('Financial Summary', 20, 55);
        
        // Create summary data with better formatting
        pdf.setFontSize(12);
        const summaryY = 70; // Starting Y position for summary
        const summaryData = [
            { label: 'Total Income:', value: `$${Number(financialData.income || 0).toLocaleString()}`, color: [34, 197, 94] }, // Green
            { label: 'Total Expenses:', value: `$${Number(financialData.expense || 0).toLocaleString()}`, color: [239, 68, 68] }, // Red
            { label: 'Current Balance:', value: `$${Number(financialData.balance || 0).toLocaleString()}`, color: [37, 99, 235] }, // Blue
            { label: 'Total Savings:', value: `$${Number(financialData.saving || 0).toLocaleString()}`, color: [168, 85, 247] } // Purple
        ];
        
        // Add each summary item with colored values
        summaryData.forEach((item, index) => {
            const yPos = summaryY + (index * 12);
            // Label in black
            pdf.setTextColor(0, 0, 0);
            pdf.text(item.label, 25, yPos);
            // Value in color
            pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
            pdf.text(item.value, 80, yPos);
        });
        
        // --- FINANCIAL HEALTH ANALYSIS ---
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Financial Health Analysis', 20, summaryY + 70);
        
        // Calculate financial ratios
        const income = Number(financialData.income || 0);
        const expense = Number(financialData.expense || 0);
        const balance = Number(financialData.balance || 0);
        const saving = Number(financialData.saving || 0);
        
        const savingsRate = income > 0 ? ((saving / income) * 100).toFixed(1) : 0;
        const expenseRatio = income > 0 ? ((expense / income) * 100).toFixed(1) : 0;
        
        pdf.setFontSize(11);
        const analysisY = summaryY + 85;
        
        // Health indicators with status
        const healthData = [
            { 
                metric: 'Savings Rate:', 
                value: `${savingsRate}%`, 
                status: savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement',
                statusColor: savingsRate >= 20 ? [34, 197, 94] : savingsRate >= 10 ? [245, 158, 11] : [239, 68, 68]
            },
            { 
                metric: 'Expense Ratio:', 
                value: `${expenseRatio}%`, 
                status: expenseRatio <= 70 ? 'Excellent' : expenseRatio <= 80 ? 'Good' : 'High Risk',
                statusColor: expenseRatio <= 70 ? [34, 197, 94] : expenseRatio <= 80 ? [245, 158, 11] : [239, 68, 68]
            },
            { 
                metric: 'Emergency Fund:', 
                value: balance >= (expense * 3) ? 'Adequate' : 'Insufficient',
                status: balance >= (expense * 3) ? `${Math.floor(balance / expense)} months` : `${(balance / expense).toFixed(1)} months`,
                statusColor: balance >= (expense * 3) ? [34, 197, 94] : [239, 68, 68]
            }
        ];
        
        healthData.forEach((item, index) => {
            const yPos = analysisY + (index * 12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(item.metric, 25, yPos);
            pdf.text(item.value, 80, yPos);
            // Status with appropriate color
            pdf.setTextColor(item.statusColor[0], item.statusColor[1], item.statusColor[2]);
            pdf.text(item.status, 120, yPos);
        });
        
        // --- TOP SPENDING CATEGORIES ---
        if (categories && categories.length > 0) {
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Top Spending Categories', 20, analysisY + 55);
            
            pdf.setFontSize(11);
            const categoriesY = analysisY + 70;
            
            // Show top 5 expense categories
            const expenseCategories = categories
                .filter(cat => cat.type === 'expense')
                .slice(0, 5);
            
            expenseCategories.forEach((cat, index) => {
                const yPos = categoriesY + (index * 10);
                pdf.setTextColor(0, 0, 0);
                pdf.text(`${index + 1}. ${cat.category}`, 25, yPos);
                pdf.setTextColor(239, 68, 68); // Red for expenses
                pdf.text(`$${Number(cat.total).toLocaleString()}`, 120, yPos);
            });
        }
        
        // --- FOOTER ---
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generated by ExpenseTracker Dashboard', 20, pageHeight - 20);
        pdf.text(`Page 1`, pageWidth - 30, pageHeight - 20);
        
        // Generate filename with current date
        const filename = `financial-report-${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Save the PDF
        pdf.save(filename);
        
        return { success: true, filename };
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        return { success: false, error: error.message };
    }
};