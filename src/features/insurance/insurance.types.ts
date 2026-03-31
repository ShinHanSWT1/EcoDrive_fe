export interface InsuranceCompany {
  name: string;
  logo: string;
  discountRate: number;
  expectedPremium: number;
  tags: string[];
  reason: string;
}

export interface CurrentInsuranceSummary {
  companyName: string;
  renewalDday: number;
  safetyScore: number;
  annualMileageKm: number;
  connectedCarLinked: boolean;
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
}

export interface InsuranceGuide {
  title: string;
  description: string;
}

export interface InsurancePageData {
  currentSummary: CurrentInsuranceSummary;
  companies: InsuranceCompany[];
  bill: InsuranceBill;
  guide: InsuranceGuide;
}
