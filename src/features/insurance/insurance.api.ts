import { api } from "../../shared/api/client";
import {
  getRecentDrivingSessions,
  type DrivingRecentSession,
} from "../driving/driving.api";
import type {
  InsurancePageData,
  InsuranceCompany,
  CurrentInsuranceSummary,
  InsuranceBill,
  InsuranceCoverage,
} from "./insurance.types";

interface CompanyResponse {
  id: number;
  companyName: string;
  code: string;
  status: string;
}

interface ProductResponse {
  id: number;
  insuranceCompanyId: number;
  companyName: string;
  productName: string;
  baseAmount: number;
  status: string;
}

interface CalculateResponse {
  ageFactor: number;
  experienceFactor: number;
  scoreDiscountRate: number;
}

interface ContractResponse {
  id: number;
  productName: string;
  companyName: string;
  planType: string | null;
  status: string | null;
  finalAmount: number;
  startedAt: string | null;
  endedAt: string | null;
}

export interface InsuranceResponse {
  id: number;
  insuranceCompanyId: number;
  companyName: string;
  insuranceProductId: number;
  productName: string;
  insuranceContractsId: number;
  planType: string;
  baseAmount: number;
  finalAmount: number;
  createdAt: string;
}

// 특정 상품의 보장 내역 조회
export async function getProductCoverages(
  productId: number,
): Promise<InsuranceCoverage[]> {
  const response = await api.get(`/insurance/products/${productId}/coverages`);
  return response.data.data.coverages || [];
}

// 보험 할인 계산에 필요한 공통 데이터를 조회
export async function getInsuranceFactors(experienceYears: number = 0) {
  const [companiesRes, productsRes] = await Promise.all([
    api.get("/insurance/companies"),
    api.get("/insurance/products"),
  ]);

  const companies: CompanyResponse[] = companiesRes.data.data.companies;
  const products: ProductResponse[] = productsRes.data.data.products;

  // 주행 기록 없으면 null
  let safetyScore: number | null = null;
  try {
    const scoreRes = await api.get("/driving/scores/latest");
    safetyScore = scoreRes.data.data.score ?? null;
  } catch {
    safetyScore = null;
  }

  let userAge = 30;
  try {
    const meRes = await api.get("/users/me");
    userAge = meRes.data.data.age ?? 30;
  } catch {
    userAge = 30;
  }

  // 1. 현재 점수 기준 할인율 계산
  const calcRes = await api.get("/insurance/discount-policies/calculate", {
    params: { age: userAge, score: safetyScore ?? 100, experienceYears },
  });
  const calc: CalculateResponse = calcRes.data.data;

  // 2. 최대 점수(100점) 기준 할인율 계산 (비교 섹션용)
  const maxCalcRes = await api.get("/insurance/discount-policies/calculate", {
    params: { age: userAge, score: 100, experienceYears },
  });
  const maxCalc: CalculateResponse = maxCalcRes.data.data;

  return { companies, products, safetyScore, userAge, calc, maxCalc };
}

// 내 보험 목록 조회
export async function getMyInsurances(): Promise<InsuranceResponse[]> {
  const insurancesRes = await api.get("/users/me/insurances");
  return insurancesRes.data.data.insurances || [];
}

export interface CreateContractRequest {
  insuranceProductId: number;
  phoneNumber: string;
  address: string;
  contractPeriod: number;
  planType: string;
  selectedCoverageIds: number[];
}

export async function createInsuranceContract(
  request: CreateContractRequest,
): Promise<ContractResponse> {
  const response = await api.post("/insurance/contracts", request);
  return response.data.data;
}

export async function getInsurancePageData(): Promise<InsurancePageData> {
  // 1. 계약 목록 먼저 조회 (experienceYears 계산용)
  let myContracts: ContractResponse[] = [];
  try {
    const contractsRes = await api.get("/insurance/contracts");
    myContracts = contractsRes.data.data.contracts || [];
  } catch {
    myContracts = [];
  }

  // 온보딩 보험 시작일 기준 운전 경력 계산 (신규는 0년)
  const oldestContract = myContracts
    .filter((c) => c.startedAt)
    .sort(
      (a, b) =>
        new Date(a.startedAt!).getTime() - new Date(b.startedAt!).getTime(),
    )[0];
  const experienceYears = oldestContract?.startedAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(oldestContract.startedAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365),
        ),
      )
    : 0;

  // 2. 공통 데이터 조회 및 최근 주행 기록 합산
  const [factors, recentSessions] = await Promise.all([
    getInsuranceFactors(experienceYears),
    getRecentDrivingSessions(20).catch((): DrivingRecentSession[] => []),
  ]);
  const { companies, products, safetyScore, calc, maxCalc } = factors;

  const totalDistance = recentSessions.reduce(
    (sum, s) => sum + s.distanceKm,
    0,
  );

  // 8. 내 보험 목록
  let myInsurances: InsuranceResponse[] = [];
  try {
    myInsurances = await getMyInsurances();
  } catch {
    myInsurances = [];
  }

  // 현재 보험 요약
  const activeContract = myContracts.find((c) => c.status === "ACTIVE");
  const activeInsurance = myInsurances.length > 0 ? myInsurances[0] : null;

  // 보험사별 예상 보험료 계산 (비교 섹션은 무조건 BASIC 플랜 기준 + 100점 만점 기준)
  const BASIC_MULTIPLIER = 0.8;
  const companyList: InsuranceCompany[] = companies
    .filter((c) => c.status === "ACTIVE")
    .map((c) => {
      const companyProducts = products.filter(
        (p) =>
          p.insuranceCompanyId === c.id &&
          (p.status === "ON_SALE" || p.status === "ACTIVE"),
      );

      const baseAmount =
        companyProducts.length > 0 ? companyProducts[0].baseAmount : 600_000;

      // 나이, 경력, BASIC 플랜 가중치 적용 (할인 전 기준 금액)
      // 비교용 기준가는 만점 기준의 보정치(maxCalc)를 따릅니다.
      const adjustedBase = Math.round(
        baseAmount *
          (maxCalc.ageFactor || 1.0) *
          (maxCalc.experienceFactor || 1.0) *
          BASIC_MULTIPLIER,
      );

      // 100점 만점 시 할인율 적용 (최대 예상 혜택 금액)
      const maxDiscountRate = maxCalc.scoreDiscountRate || 0;
      const expectedPremium = Math.round(adjustedBase * (1 - maxDiscountRate));

      return {
        id: companyProducts[0]?.id || 0,
        name: c.companyName,
        logo: c.companyName.substring(0, 2),
        discountRate: Math.round(maxDiscountRate * 1000) / 10,
        basePremium: adjustedBase,
        expectedPremium,
        tags: [
          "기본형(실속형)",
          ...companyProducts.map((p) => p.productName).slice(0, 1),
        ],
        reason: `안전점수 100점 달성 시 최대 ${Math.round(maxDiscountRate * 100)}% 할인 가능`,
      };
    });

  // 가입된 보험 상품 기준 산출서 계산 (없으면 첫 번째 상품 기준)
  const activeProduct = activeInsurance
    ? products.find((p) => p.id === activeInsurance.insuranceProductId)
    : null;

  const representativeBase =
    activeInsurance && typeof activeInsurance.baseAmount === "number"
      ? activeInsurance.baseAmount
      : (activeProduct?.baseAmount ??
        (products.length > 0 ? products[0].baseAmount : 600_000));

  const representativeAdjusted =
    activeInsurance && typeof activeInsurance.baseAmount === "number"
      ? activeInsurance.baseAmount
      : Math.round(
          representativeBase *
            (calc.ageFactor || 1.0) *
            (calc.experienceFactor || 1.0),
        );

  const currentDiscountRate = calc.scoreDiscountRate || 0;
  const representativeFinal = Math.round(
    representativeAdjusted * (1 - currentDiscountRate),
  );

  const representativeDiscount =
    totalDistance > 15000 ? 0 : representativeAdjusted - representativeFinal;

  const planLabels: Record<string, string> = {
    BASIC: "기본형",
    STANDARD: "표준형",
    PREMIUM: "프리미엄형",
  };
  const currentPlanLabel = activeInsurance
    ? planLabels[activeInsurance.planType] || "표준형"
    : "";

  let currentProductLabel = activeInsurance
    ? activeInsurance.productName
    : "가입된 상품 없음";
  if (activeInsurance) {
    currentProductLabel = currentProductLabel
      .replace(/표준형|기본형|프리미엄형/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const currentSummary: CurrentInsuranceSummary = {
    companyName:
      activeInsurance?.companyName ??
      activeContract?.companyName ??
      "가입된 보험 없음",
    renewalDday: activeContract?.endedAt
      ? Math.ceil(
          (new Date(activeContract.endedAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : 0,
    safetyScore,
    annualMileageKm: totalDistance,
    expectedPremium: totalDistance > 15000 ? representativeAdjusted : representativeFinal,
    expectedDiscountRate: totalDistance > 15000 ? 0 : Math.round(currentDiscountRate * 1000) / 10,
    totalExpectedSavings: representativeDiscount,
  };

  const bill: InsuranceBill = {
    issuedAt: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    contractNumber: activeContract
      ? `ED-${activeContract.id}`
      : `ED-${new Date().getFullYear()}-NEW`,
    basePremium: representativeAdjusted,
    discountItems: [
      {
        label: "안전운전 할인",
        amount: representativeDiscount,
        badge: `${safetyScore ?? 100}점 적용`,
        tone: "blue" as const,
      },
    ],
    totalDiscountRate:
      totalDistance > 15000 ? 0 : Math.round(currentDiscountRate * 1000) / 10,
    finalPremium: totalDistance > 15000 ? representativeAdjusted : representativeFinal,
    productNameLabel: `${currentProductLabel} ${currentPlanLabel}`.trim(),
  };

  return {
    currentSummary,
    companies: companyList,
    bill,
  };
}
