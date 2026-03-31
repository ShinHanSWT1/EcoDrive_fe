import {
  currentInsuranceSummary,
  insuranceBill,
  insuranceCompanies,
  insuranceGuide,
} from "./insurance.mock";

import type { InsurancePageData } from "./insurance.types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getInsurancePageData(): Promise<InsurancePageData> {
  await delay(300);

  return {
    currentSummary: currentInsuranceSummary,
    companies: insuranceCompanies,
    bill: insuranceBill,
    guide: insuranceGuide,
  };
}
