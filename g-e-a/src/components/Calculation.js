// Calculation.js
import { useState, useEffect } from "react";

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

    // Get exam fee based on selected type
    const getExamFee = () => {
        switch (examType) {
            case "ielts-paper":
                return 31500;
            case "ielts-computer":
                return 28800;
            case "pte":
                return 200 * 130;
            case "toefl":
                return 195 * 130;
            default:
                return 0;
        }
    };

    // Calculate bank processing fee
    const getBankProcessingFee = () => {
        return loanAmount * (bankProcessingRate / 100);
    };

    // Calculate monthly installment
    const getMonthlyInstallment = () => {
        if (disbursementAmount <= 0 || interestRate <= 0) return 0;
    
        // Convert annual interest rate to monthly and decimal format
        const monthlyInterestRate = (interestRate / 100) / 12;
        
        // Convert repayment period to months 
        const loanTermMonths = 15 * 12; 
        
        // Standard EMI formula
        const emi = (disbursementAmount * 
                    monthlyInterestRate * 
                    Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
                    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    
        return emi;
    };

    // Calculate translation cost
    const getTranslationCost = () => {
        return translationPages * 400;
    };

    // Calculate notary cost
    const getNotaryCost = () => {
        return notaryPages * 10;
    };

    // Calculate engineering costs
    const getEngineeringCost = () => {
        let cost = 0;
        if (bankValuation) cost += 10000;
        if (caReport) cost += 2500;
        if (propertyValuation) cost += 1500;
        return cost;
    };

    // Calculate NOC cost
    const getNocCost = () => {
        return nocPrograms * 2000;
    };

    // Calculate education tax
    const getEducationTax = () => {
        return tuitionFee * 0.03;
    };

    // Calculate medical cost
    const getMedicalCost = () => {
        return medicalProvider === "Norvic" ? 10000 : 70 * 130; 
    };

    // Calculate total cost - modified to exclude tuition fee if bank loan is provided
    const getTotalCost = () => {
        const englishCosts = englishClassCost + getExamFee();
        const gsCosts =
            getBankProcessingFee() + getTranslationCost() + getNotaryCost() + getEngineeringCost() + getNocCost();

        // If loan amount is provided, exclude tuition fee from total
        const coeCosts =
            loanAmount > 0
                ? paymentCompanyFee + healthCareCost * 130 // Exclude tuition fee and education tax
                : tuitionFee + getEducationTax() + paymentCompanyFee + healthCareCost * 90;

        const visaCosts = 1610 * 90 + 3575 + getMedicalCost(); // Convert AUD to NPR for visa fee

        return englishCosts + applicationCost + gsCosts + coeCosts + visaCosts;
    };

    // Calculate category subtotals - modified to handle loan amount logic
    const getCategoryTotal = (category) => {
        switch (category) {
            case "english":
                return englishClassCost + getExamFee();
            case "offer":
                return applicationCost;
            case "gs":
                return getBankProcessingFee() + getTranslationCost() + getNotaryCost() + getEngineeringCost() + getNocCost();
            case "coe":
                // If loan amount is provided, exclude tuition fee from COE stage total
                return loanAmount > 0
                    ? paymentCompanyFee + healthCareCost * 130 // Exclude tuition fee and education tax
                    : tuitionFee + getEducationTax() + paymentCompanyFee + healthCareCost * 90;
            case "visa":
                return 1610 * 90 + 3575 + getMedicalCost();
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