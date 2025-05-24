import { useState, useEffect } from "react";

// Constant for currency conversion (AUD to NPR)
const AUD_TO_NPR = 90;

export const useCalculation = () => {
    // English Proficiency
    const [englishTest, setEnglishTest] = useState("");
    const [englishClassCost, setEnglishClassCost] = useState(5000);
    const [examType, setExamType] = useState("");

    // Offer Letter
    const [applicationCost, setApplicationCost] = useState(0);

    // GS Stage
    const [loanAmount, setLoanAmount] = useState(0);
    const [bankProcessingRate, setBankProcessingRate] = useState(0.75);
    const [disbursementAmount, setDisbursementAmount] = useState(0);
    const [interestRate, setInterestRate] = useState(8);
    const [translationPages, setTranslationPages] = useState(0);
    const [notaryPages, setNotaryPages] = useState(0);
    const [bankValuation, setBankValuation] = useState(true);
    const [caReport, setCAReport] = useState(true);
    const [propertyValuation, setPropertyValuation] = useState(true);
    const [nocPrograms, setNocPrograms] = useState(1);

    // COE Stage
    const [tuitionFee, setTuitionFee] = useState(0);
    const [paymentCompanyFee, setPaymentCompanyFee] = useState(0);
    const [healthCareCost, setHealthCareCost] = useState(2500);

    // Visa Stage
    const [medicalProvider, setMedicalProvider] = useState("Norvic");

    // Utility function to parse numeric inputs safely
    const parseNumber = (value) => {
        if (value === "" || value == null) return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    // Get exam fee based on selected type (in NPR)
    const getExamFee = () => {
        switch (examType) {
            case "ielts-paper":
                return 31500;
            case "ielts-computer":
                return 28800;
            case "pte":
                return 200 * AUD_TO_NPR;
            case "toefl":
                return 195 * AUD_TO_NPR;
            default:
                return 0;
        }
    };

    // Calculate bank processing fee (percentage of loan amount)
    const getBankProcessingFee = () => {
        const loan = parseNumber(loanAmount);
        const rate = parseNumber(bankProcessingRate);
        return loan * (rate / 100);
    };

    // Calculate monthly installment (EMI) for the loan
    const getMonthlyInstallment = () => {
        const disbursement = parseNumber(disbursementAmount);
        const rate = parseNumber(interestRate);
        if (disbursement <= 0 || rate <= 0) return 0;

        // Convert annual interest rate to monthly decimal
        const monthlyInterestRate = (rate / 100) / 12;
        // Assume 15-year loan term
        const loanTermMonths = 15 * 12;

        // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
        const emi =
            (disbursement *
                monthlyInterestRate *
                Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
            (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

        return isNaN(emi) ? 0 : emi;
    };

    // Calculate translation cost (NPR 400 per page)
    const getTranslationCost = () => {
        return parseNumber(translationPages) * 400;
    };

    // Calculate notary cost (NPR 10 per page)
    const getNotaryCost = () => {
        return parseNumber(notaryPages) * 10;
    };

    // Calculate engineering costs (fixed costs for valuations and reports)
    const getEngineeringCost = () => {
        let cost = 0;
        if (bankValuation) cost += 10000;
        if (caReport) cost += 2500;
        if (propertyValuation) cost += 1500;
        return cost;
    };

    // Calculate NOC cost (NPR 2000 per program)
    const getNocCost = () => {
        return parseNumber(nocPrograms) * 2000;
    };

    // Calculate education tax (3% of tuition fee)
    const getEducationTax = () => {
        return parseNumber(tuitionFee) * 0.03;
    };

    // Calculate medical cost based on provider (in NPR)
    const getMedicalCost = () => {
        return medicalProvider === "Norvic" ? 10000 : 70 * AUD_TO_NPR;
    };

    // Calculate total cost, excluding tuition fee if loan is provided
    const getTotalCost = () => {
        const englishCosts = parseNumber(englishClassCost) + getExamFee();
        const gsCosts =
            getBankProcessingFee() +
            getTranslationCost() +
            getNotaryCost() +
            getEngineeringCost() +
            getNocCost();
        const coeCosts =
            parseNumber(loanAmount) > 0
                ? parseNumber(paymentCompanyFee) +
                parseNumber(healthCareCost) * AUD_TO_NPR
                : parseNumber(tuitionFee) +
                getEducationTax() +
                parseNumber(paymentCompanyFee) +
                parseNumber(healthCareCost) * AUD_TO_NPR;
        const visaCosts =
            1610 * AUD_TO_NPR + 3575 + getMedicalCost();

        return (
            englishCosts +
            parseNumber(applicationCost) +
            gsCosts +
            coeCosts +
            visaCosts
        );
    };

    // Calculate subtotal for each category
    const getCategoryTotal = (category) => {
        switch (category) {
            case "english":
                return parseNumber(englishClassCost) + getExamFee();
            case "offer":
                return parseNumber(applicationCost);
            case "gs":
                return (
                    getBankProcessingFee() +
                    getTranslationCost() +
                    getNotaryCost() +
                    getEngineeringCost() +
                    getNocCost()
                );
            case "coe":
                return parseNumber(loanAmount) > 0
                    ? parseNumber(paymentCompanyFee) +
                    parseNumber(healthCareCost) * AUD_TO_NPR
                    : parseNumber(tuitionFee) +
                    getEducationTax() +
                    parseNumber(paymentCompanyFee) +
                    parseNumber(healthCareCost) * AUD_TO_NPR;
            case "visa":
                return 1610 * AUD_TO_NPR + 3575 + getMedicalCost();
            default:
                return 0;
        }
    };

    return {
        englishTest,
        setEnglishTest,
        englishClassCost,
        setEnglishClassCost,
        examType,
        setExamType,
        applicationCost,
        setApplicationCost,
        loanAmount,
        setLoanAmount,
        bankProcessingRate,
        setBankProcessingRate,
        disbursementAmount,
        setDisbursementAmount,
        interestRate,
        setInterestRate,
        translationPages,
        setTranslationPages,
        notaryPages,
        setNotaryPages,
        bankValuation,
        setBankValuation,
        caReport,
        setCAReport,
        propertyValuation,
        setPropertyValuation,
        nocPrograms,
        setNocPrograms,
        tuitionFee,
        setTuitionFee,
        paymentCompanyFee,
        setPaymentCompanyFee,
        healthCareCost,
        setHealthCareCost,
        medicalProvider,
        setMedicalProvider,
        getExamFee,
        getBankProcessingFee,
        getMonthlyInstallment,
        getTranslationCost,
        getNotaryCost,
        getEngineeringCost,
        getNocCost,
        getEducationTax,
        getMedicalCost,
        getTotalCost,
        getCategoryTotal,
    };
};