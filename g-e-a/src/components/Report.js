// Report.js
export const generateReport = (data) => {
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
        getTotalCost,
        getCategoryTotal,
        getMonthlyInstallment,
    } = data;

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatCurrency = (amount) => {
        return amount.toLocaleString();
    };

    const lineBreak = "═".repeat(80);
    const sectionBreak = "─".repeat(80);
    const smallBreak = "─".repeat(40);

    // Calculate monthly EMI
    const monthlyEMI = getMonthlyInstallment();

    const report = `
╔${lineBreak}╗
║                        STUDY ABROAD COST ESTIMATION REPORT                      ║
║                                                                                 ║
║                               Generated: ${currentDate}                         ║
╚${lineBreak}╝

SUMMARY OF ESTIMATED COSTS
${sectionBreak}

┌${"─".repeat(25)}┬${"─".repeat(20)}┬${"─".repeat(30)}┐
│ Category            │ Amount (NPR)      │ Percentage of Total         │
├${"─".repeat(25)}┼${"─".repeat(20)}┼${"─".repeat(30)}┤
│ English Proficiency │ ${formatCurrency(getCategoryTotal("english")).padStart(18, " ")} │ ${((getCategoryTotal("english") / getTotalCost()) * 100).toFixed(2).padStart(8, " ")}%                │
│ Offer Letter        │ ${formatCurrency(getCategoryTotal("offer")).padStart(18, " ")} │ ${((getCategoryTotal("offer") / getTotalCost()) * 100).toFixed(2).padStart(8, " ")}%                │
│ GS Stage            │ ${formatCurrency(getCategoryTotal("gs")).padStart(18, " ")} │ ${((getCategoryTotal("gs") / getTotalCost()) * 100).toFixed(2).padStart(8, " ")}%                │
│ COE Stage           │ ${formatCurrency(getCategoryTotal("coe")).padStart(18, " ")} │ ${((getCategoryTotal("coe") / getTotalCost()) * 100).toFixed(2).padStart(8, " ")}%                │
│ Visa Stage          │ ${formatCurrency(getCategoryTotal("visa")).padStart(18, " ")} │ ${((getCategoryTotal("visa") / getTotalCost()) * 100).toFixed(2).padStart(8, " ")}%                │
├${"─".repeat(25)}┼${"─".repeat(20)}┼${"─".repeat(30)}┤
│ TOTAL               │ ${formatCurrency(getTotalCost()).padStart(18, " ")} │ 100.00%                      │
└${"─".repeat(25)}┴${"─".repeat(20)}┴${"─".repeat(30)}┘


DETAILED BREAKDOWN
${sectionBreak}

1. ENGLISH PROFICIENCY
${smallBreak}

   English Class Cost:                                NPR ${formatCurrency(englishClassCost)}
   Exam Type:                                         ${examType === "ielts-paper"
            ? "IELTS Paper-based"
            : examType === "ielts-computer"
                ? "IELTS Computer-based"
                : examType === "pte"
                    ? "PTE"
                    : examType === "toefl"
                        ? "TOEFL iBT"
                        : "Not selected"
        }
   Exam Fee:                                          NPR ${formatCurrency(getExamFee())}
                                                      ${"-".repeat(40)}
   SUBTOTAL:                                          NPR ${formatCurrency(getCategoryTotal("english"))}


2. OFFER LETTER
${smallBreak}

   Application Cost:                                  NPR ${formatCurrency(applicationCost)}
                                                      ${"-".repeat(40)}
   SUBTOTAL:                                          NPR ${formatCurrency(getCategoryTotal("offer"))}


3. GS STAGE
${smallBreak}

   Bank Loan Details:
   ─────────────────
   Bank Loan Amount:                                  NPR ${formatCurrency(loanAmount)}
   Bank Processing Fee (${bankProcessingRate}%):                     NPR ${formatCurrency(getBankProcessingFee())}
   Disbursement Amount:                               NPR ${formatCurrency(disbursementAmount)}
   Monthly EMI (${interestRate}%):                              NPR ${formatCurrency(monthlyEMI)}

   Documentation Costs:
   ─────────────────
   Translation (${translationPages} pages @ NPR 400/page):           NPR ${formatCurrency(getTranslationCost())}
   Notary (${notaryPages} pages @ NPR 10/page):                   NPR ${formatCurrency(getNotaryCost())}

   Engineering Costs:
   ─────────────────
   Bank Property Valuation:                           NPR ${bankValuation ? "10,000" : "0"}
   CA Report:                                         NPR ${caReport ? "2,500" : "0"}
   Property Valuation:                                NPR ${propertyValuation ? "1,500" : "0"}

   No Objection Letter (NOC):
   ─────────────────
   NOC (${nocPrograms} program${nocPrograms > 1 ? "s" : ""}):                                NPR ${formatCurrency(getNocCost())}
                                                      ${"-".repeat(40)}
   SUBTOTAL:                                          NPR ${formatCurrency(getCategoryTotal("gs"))}


4. COE STAGE
${smallBreak}

   Tuition Fee Payment:
   ─────────────────
   Tuition Fee:                                       NPR ${formatCurrency(tuitionFee)}${loanAmount > 0 ? " (Covered by loan)" : ""}
   Education Tax (3%):                                NPR ${formatCurrency(getEducationTax())}${loanAmount > 0 ? " (Covered by loan)" : ""}
   Payment Company Fee:                               NPR ${formatCurrency(paymentCompanyFee)}

   Health Insurance:
   ─────────────────
   Health Care (AUD ${healthCareCost}):                          NPR ${formatCurrency(healthCareCost * 130)}
                                                      ${"-".repeat(40)}
   SUBTOTAL:                                          NPR ${formatCurrency(getCategoryTotal("coe"))}${loanAmount > 0 ? " (Excluding tuition fee)" : ""}


5. VISA STAGE
${smallBreak}

   Visa Fee (AUD 1,610):                              NPR ${formatCurrency(1610 * 90)}
   Biometric:                                         NPR 3,575
   Medical (${medicalProvider === "Norvic" ? "Norvic" : "IOM Nepal"}):                                 NPR ${formatCurrency(getMedicalCost())}
                                                      ${"-".repeat(40)}
   SUBTOTAL:                                          NPR ${formatCurrency(getCategoryTotal("visa"))}


${lineBreak}
TOTAL ESTIMATED COST:                                 NPR ${formatCurrency(getTotalCost())}
${lineBreak}

${disbursementAmount > 0
            ? `
LOAN INFORMATION
${smallBreak}

   Disbursement Amount:                               NPR ${formatCurrency(disbursementAmount)}
   Interest Rate:                                     ${interestRate}%
   Loan Term:                                         12 months
   Monthly EMI:                                       NPR ${formatCurrency(monthlyEMI)}
   Total Interest Payable:                            NPR ${formatCurrency(monthlyEMI * 12 - disbursementAmount)}
   Total Amount Payable:                              NPR ${formatCurrency(monthlyEMI * 12)}
`
            : ""
        }

Notes:
- All costs are estimates and may vary based on actual circumstances
- Exchange rate used: 1 AUD = 90 NPR
${loanAmount > 0 ? "- Tuition fee and education tax are excluded from the total as they are covered by the loan" : ""}
- Report generated on ${currentDate}
- This is not an official document and should be used for planning purposes only

${lineBreak}
  `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Study_Abroad_Cost_Estimation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};