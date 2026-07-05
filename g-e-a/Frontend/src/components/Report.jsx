import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Formatting current date
const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Formatting numbers with thousands separators
const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
};

// Calculating percentage safely
const calculatePercentage = (part, total) => {
    if (total === 0) return "0.00";
    return ((part / total) * 100).toFixed(2);
};

// Generating exam type description
const getExamTypeDescription = (examType) => {
    switch (examType) {
        case "ielts-paper": return "IELTS Paper-based";
        case "ielts-computer": return "IELTS Computer-based";
        case "pte": return "PTE";
        case "toefl": return "TOEFL iBT";
        default: return "Not selected";
    }
};

// Generating medical provider description
const getMedicalProviderDescription = (medicalProvider) => {
    return medicalProvider === "Norvic" ? "Norvic" : "IOM Nepal";
};

// Styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    subSectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    table: {
        border: '1pt solid black',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid black',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    tableCell: {
        padding: 5,
    },
    tableCellCategory: {
        width: '40%',
        padding: 5,
    },
    tableCellAmount: {
        width: '30%',
        textAlign: 'right',
        padding: 5,
    },
    tableCellPercentage: {
        width: '30%',
        textAlign: 'right',
        padding: 5,
    },
    item: {
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    total: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'right',
    },
    notes: {
        marginTop: 20,
        fontSize: 9,
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: 'grey',
    },
});

// React-PDF Document Component
const ReportDocument = ({
    data,
    currentDate,
    monthlyEMI,
    totalCost,
    loanTermMonths,
}) => {
    const {
        englishClassCost,
        examType,
        getExamFee,
        applicationCost,
        loanAmount,
        bankProcessingRate,
        getBankProcessingFee,
        disbursementAmount,
        interestRate,
        translationPages,
        getTranslationCost,
        notaryPages,
        getNotaryCost,
        bankValuation,
        caReport,
        propertyValuation,
        getEngineeringCost,
        nocPrograms,
        getNocCost,
        tuitionFee,
        getEducationTax,
        paymentCompanyFee,
        healthCareCost,
        medicalProvider,
        getMedicalCost,
        getCategoryTotal,
    } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>Study Abroad Cost Estimation Report</Text>
                <Text style={styles.subHeader}>Generated on {currentDate}</Text>

                {/* Summary of Estimated Costs */}
                <Text style={styles.sectionTitle}>Summary of Estimated Costs</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCellCategory}>Category</Text>
                        <Text style={styles.tableCellAmount}>Amount (NPR)</Text>
                        <Text style={styles.tableCellPercentage}>Percentage of Total</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellCategory}>English Proficiency</Text>
                        <Text style={styles.tableCellAmount}>{formatCurrency(getCategoryTotal("english"))}</Text>
                        <Text style={styles.tableCellPercentage}>{calculatePercentage(getCategoryTotal("english"), totalCost)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellCategory}>Offer Letter</Text>
                        <Text style={styles.tableCellAmount}>{formatCurrency(getCategoryTotal("offer"))}</Text>
                        <Text style={styles.tableCellPercentage}>{calculatePercentage(getCategoryTotal("offer"), totalCost)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellCategory}>GS Stage</Text>
                        <Text style={styles.tableCellAmount}>{formatCurrency(getCategoryTotal("gs"))}</Text>
                        <Text style={styles.tableCellPercentage}>{calculatePercentage(getCategoryTotal("gs"), totalCost)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellCategory}>COE Stage</Text>
                        <Text style={styles.tableCellAmount}>{formatCurrency(getCategoryTotal("coe"))}</Text>
                        <Text style={styles.tableCellPercentage}>{calculatePercentage(getCategoryTotal("coe"), totalCost)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellCategory}>Visa Stage</Text>
                        <Text style={styles.tableCellAmount}>{formatCurrency(getCategoryTotal("visa"))}</Text>
                        <Text style={styles.tableCellPercentage}>{calculatePercentage(getCategoryTotal("visa"), totalCost)}%</Text>
                    </View>
                    <View style={[styles.tableRow, { borderBottom: 'none' }]}>
                        <Text style={[styles.tableCellCategory, styles.bold]}>Total</Text>
                        <Text style={[styles.tableCellAmount, styles.bold]}>{formatCurrency(totalCost)}</Text>
                        <Text style={[styles.tableCellPercentage, styles.bold]}>100.00%</Text>
                    </View>
                </View>

                {/* Detailed Breakdown */}
                <Text style={styles.sectionTitle}>Detailed Breakdown</Text>

                {/* 1. English Proficiency */}
                <Text style={styles.subSectionTitle}>1. English Proficiency</Text>
                <Text style={styles.item}>English Class Cost: {formatCurrency(englishClassCost)} NPR</Text>
                <Text style={styles.item}>Exam Type: {getExamTypeDescription(examType)}</Text>
                <Text style={styles.item}>Exam Fee: {formatCurrency(getExamFee())} NPR</Text>
                <Text style={[styles.item, styles.bold]}>Subtotal: {formatCurrency(getCategoryTotal("english"))} NPR</Text>

                {/* 2. Offer Letter */}
                <Text style={styles.subSectionTitle}>2. Offer Letter</Text>
                <Text style={styles.item}>Application Cost: {formatCurrency(applicationCost)} NPR</Text>
                <Text style={[styles.item, styles.bold]}>Subtotal: {formatCurrency(getCategoryTotal("offer"))} NPR</Text>

                {/* 3. GS Stage */}
                <Text style={styles.subSectionTitle}>3. GS Stage</Text>
                <Text style={styles.subSectionTitle}>Bank Loan Details:</Text>
                <Text style={styles.item}>Bank Loan Amount: {formatCurrency(loanAmount)} NPR</Text>
                <Text style={styles.item}>Bank Processing Fee ({bankProcessingRate}%): {formatCurrency(getBankProcessingFee())} NPR</Text>
                <Text style={styles.item}>Disbursement Amount: {formatCurrency(disbursementAmount)} NPR</Text>
                <Text style={styles.item}>Monthly EMI ({interestRate}%): {formatCurrency(monthlyEMI)} NPR</Text>
                <Text style={styles.subSectionTitle}>Documentation Costs:</Text>
                <Text style={styles.item}>Translation ({translationPages} pages @ NPR 400/page): {formatCurrency(getTranslationCost())} NPR</Text>
                <Text style={styles.item}>Notary ({notaryPages} pages @ NPR 10/page): {formatCurrency(getNotaryCost())} NPR</Text>
                <Text style={styles.subSectionTitle}>Engineering Costs:</Text>
                <Text style={styles.item}>Bank Property Valuation: {bankValuation ? '10,000' : '0'} NPR</Text>
                <Text style={styles.item}>CA Report: {caReport ? '2,500' : '0'} NPR</Text>
                <Text style={styles.item}>Property Valuation: {propertyValuation ? '1,500' : '0'} NPR</Text>
                <Text style={styles.subSectionTitle}>No Objection Letter (NOC):</Text>
                <Text style={styles.item}>NOC ({nocPrograms} program{nocPrograms > 1 ? 's' : ''}): {formatCurrency(getNocCost())} NPR</Text>
                <Text style={[styles.item, styles.bold]}>Subtotal: {formatCurrency(getCategoryTotal("gs"))} NPR</Text>

                {/* 4. COE Stage */}
                <Text style={styles.subSectionTitle}>4. COE Stage</Text>
                <Text style={styles.subSectionTitle}>Tuition Fee Payment:</Text>
                <Text style={styles.item}>Tuition Fee: {formatCurrency(tuitionFee)} NPR{loanAmount > 0 ? ' (Covered by loan)' : ''}</Text>
                <Text style={styles.item}>Education Tax (3%): {formatCurrency(getEducationTax())} NPR{loanAmount > 0 ? ' (Covered by loan)' : ''}</Text>
                <Text style={styles.item}>Payment Company Fee: {formatCurrency(paymentCompanyFee)} NPR</Text>
                <Text style={styles.subSectionTitle}>Health Insurance:</Text>
                <Text style={styles.item}>Health Care (AUD {healthCareCost}): {formatCurrency(healthCareCost * 90)} NPR</Text>
                <Text style={[styles.item, styles.bold]}>Subtotal: {formatCurrency(getCategoryTotal("coe"))} NPR{loanAmount > 0 ? ' (Excluding tuition fee)' : ''}</Text>

                {/* 5. Visa Stage */}
                <Text style={styles.subSectionTitle}>5. Visa Stage</Text>
                <Text style={styles.item}>Visa Fee (AUD 1,610): {formatCurrency(1610 * 90)} NPR</Text>
                <Text style={styles.item}>Biometric: 3,575 NPR</Text>
                <Text style={styles.item}>Medical ({getMedicalProviderDescription(medicalProvider)}): {formatCurrency(getMedicalCost())} NPR</Text>
                <Text style={[styles.item, styles.bold]}>Subtotal: {formatCurrency(getCategoryTotal("visa"))} NPR</Text>

                {/* Total */}
                <Text style={styles.total}>Total Estimated Cost: {formatCurrency(totalCost)} NPR</Text>

                {/* Loan Information */}
                {disbursementAmount > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Loan Information</Text>
                        <Text style={styles.item}>Disbursement Amount: {formatCurrency(disbursementAmount)} NPR</Text>
                        <Text style={styles.item}>Interest Rate: {interestRate}%</Text>
                        <Text style={styles.item}>Loan Term: 15 years</Text>
                        <Text style={styles.item}>Monthly EMI: {formatCurrency(monthlyEMI)} NPR</Text>
                        <Text style={styles.item}>Total Interest Payable: {formatCurrency(monthlyEMI * loanTermMonths - disbursementAmount)} NPR</Text>
                        <Text style={styles.item}>Total Amount Payable: {formatCurrency(monthlyEMI * loanTermMonths)} NPR</Text>
                    </>
                )}

                {/* Notes */}
                <Text style={styles.notes}>Notes:</Text>
                <Text style={styles.notes}>- All costs are estimates and may vary based on actual circumstances.</Text>
                <Text style={styles.notes}>- Exchange rate used: 1 AUD = 90 NPR.</Text>
                {loanAmount > 0 && (
                    <Text style={styles.notes}>- Tuition fee and education tax are excluded from the total as they are covered by the loan.</Text>
                )}
                <Text style={styles.notes}>- Report generated on {currentDate}.</Text>
                <Text style={styles.notes}>- This is not an official document and should be used for planning purposes only.</Text>

                {/* Footer */}
                <Text style={styles.footer} fixed>Generated on {currentDate}</Text>
            </Page>
        </Document>
    );
};

export const generateReport = async (data) => {
    const currentDate = formatDate();
    const monthlyEMI = data.getMonthlyInstallment();
    const totalCost = data.getTotalCost();
    const loanTermMonths = 15 * 12; // Consistent with Calculation.js (15 years)

    // Generate PDF blob
    const blob = await pdf(
        <ReportDocument
            data={data}
            currentDate={currentDate}
            monthlyEMI={monthlyEMI}
            totalCost={totalCost}
            loanTermMonths={loanTermMonths}
        />
    ).toBlob();

    // Download the PDF
    saveAs(blob, 'Study_Abroad_Cost_Estimation.pdf');
};