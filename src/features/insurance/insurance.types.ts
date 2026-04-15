export interface InsuranceCoverage {
  id: number;
  category: string;
  coverageName: string;
  coverageAmount: number;
  isRequired: boolean;
  planType: string;
}

export interface InsuranceCompany {
  id: number; // productId
  name: string;
  logo: string;
  discountRate: number;
  basePremium: number;
  expectedPremium: number;
  tags: string[];
  reason: string;
}

export interface CurrentInsuranceSummary {
  companyName: string;
  renewalDday: number;
  safetyScore: number | null;
  annualMileageKm: number;
  expectedPremium: number;
  expectedDiscountRate: number;
  totalExpectedSavings: number;
}

export interface InsuranceBillItem {
  label: string;
  amount: number;
  badge?: string;
  tone?: "default" | "blue" | "green";
}

export interface InsuranceBill {
  issuedAt: string;
  contractNumber: string;
  basePremium: number;
  discountItems: InsuranceBillItem[];
  totalDiscountRate: number;
  finalPremium: number;
  productNameLabel?: string;
}

export interface InsurancePageData {
  currentSummary: CurrentInsuranceSummary;
  companies: InsuranceCompany[];
  bill: InsuranceBill;
}
