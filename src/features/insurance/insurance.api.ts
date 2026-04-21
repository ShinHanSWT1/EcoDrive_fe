import { api } from "../../shared/api/client";
import {
 getRecentDrivingSessions,
 getLatestDrivingScoreByVehicle,
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
 userVehicleId: number;
 insuranceCompanyId: number;
 companyName: string;
 insuranceProductId: number;
 productName: string;
 insuranceContractsId: number;
 planType: string;
 baseAmount: number;
 finalAmount: number;
 status: string;
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
export async function getInsuranceFactors(
 experienceYears: number = 0,
 annualMileageKm?: number,
 userVehicleId?: number | null,
) {
 const [companiesRes, productsRes] = await Promise.all([
 api.get("/insurance/companies"),
 api.get("/insurance/products"),
 ]);

 const companies: CompanyResponse[] = companiesRes.data.data.companies;
 const products: ProductResponse[] = productsRes.data.data.products;

 // 주행 기록 없으면 null
 let safetyScore: number | null = null;
 try {
 const score = await getLatestDrivingScoreByVehicle(userVehicleId);
 safetyScore = score.score ?? null;
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

 // 연간 주행거리: 호출자가 넘기지 않으면 BE 기준(최근 1년)으로 직접 조회
 let resolvedMileage = annualMileageKm ?? 0;
 if (annualMileageKm === undefined) {
 try {
 const mileageRes = await api.get("/driving/annual-distance");
 resolvedMileage = mileageRes.data.data ?? 0;
 } catch {
 resolvedMileage = 0;
 }
 }

 // 1. 현재 점수 + 주행거리 기준 할인율 계산
 const calcRes = await api.get("/insurance/discount-policies/calculate", {
 params: { age: userAge, score: safetyScore ?? 0, experienceYears, annualMileageKm: resolvedMileage },
 });
 const calc: CalculateResponse = calcRes.data.data;

 // 2. 최대 점수(100점) + 기준 주행거리(10000km) 기준 할인율 계산 (비교 섹션용)
 const maxCalcRes = await api.get("/insurance/discount-policies/calculate", {
 params: { age: userAge, score: 100, experienceYears, annualMileageKm: 10000 },
 });
 const maxCalc: CalculateResponse = maxCalcRes.data.data;

 return { companies, products, safetyScore, userAge, calc, maxCalc };
}

// 내 보험 목록 조회
export async function getMyInsurances(): Promise<InsuranceResponse[]> {
 const insurancesRes = await api.get("/users/me/insurances");
 return insurancesRes.data.data.insurances || [];
}

// 기존 활성 보험 계약 해지
export async function cancelInsuranceContract(contractId: number): Promise<void> {
 await api.patch(`/insurance/contracts/${contractId}/cancel`);
}

export interface CreateContractRequest {
 insuranceProductId: number;
 phoneNumber: string;
 address: string;
 contractPeriod: number;
 planType: string;
 selectedCoverageIds: number[];
 signatureImage: string;
 email: string;
}

export async function createInsuranceContract(
 request: CreateContractRequest,
): Promise<ContractResponse> {
 const response = await api.post("/insurance/contracts", request);
 return response.data.data;
}

export interface InsuranceCheckoutPrepareRequest {
 insuranceProductId: number;
 userVehicleId: number;
 phoneNumber: string;
 address: string;
 contractPeriod: number;
 planType: string;
 selectedCoverageIds: number[];
 signatureImage: string;
 email: string;
 successUrl: string;
 failUrl: string;
 pointAmount?: number;
}

export interface InsuranceCheckoutPrepareResponse {
 insuranceContractId: number;
 orderId: string;
 sessionToken: string;
 checkoutUrl: string;
 amount: number;
 pointAmount: number;
 finalAmount: number;
 expiresAt: string;
}

export interface InsuranceCheckoutConfirmResponse {
 orderId: string;
 paymentId: number;
 insuranceContractId: number;
 userInsuranceId: number;
 contractStatus: string;
}

export async function prepareInsuranceCheckout(
 request: InsuranceCheckoutPrepareRequest,
): Promise<InsuranceCheckoutPrepareResponse> {
 const response = await api.post("/insurance/checkout/prepare", request);
 return response.data.data;
}

export async function confirmInsuranceCheckout(
 orderId: string,
 paymentId: number,
 amount: number,
 status: string | null,
): Promise<InsuranceCheckoutConfirmResponse> {
 const response = await api.post("/insurance/checkout/confirm", {
 orderId,
 paymentId,
 amount,
 status,
 });
 return response.data.data;
}

export async function getInsurancePageData(
 userVehicleId?: number | null,
): Promise<InsurancePageData> {
 const [companiesRes, productsRes, myInsurances, myContracts, scoreRes, mileageRes, userRes] = await Promise.all([
 api.get("/insurance/companies"),
 api.get("/insurance/products"),
 getMyInsurances().catch((): InsuranceResponse[] => []),
 api.get("/insurance/contracts").then((r) => r.data.data.contracts as ContractResponse[]).catch((): ContractResponse[] => []),
 getLatestDrivingScoreByVehicle(userVehicleId).catch(() => ({ score: null, snapshotDate: null })),
 api.get("/driving/annual-distance", { params: userVehicleId ? { userVehicleId } : {} }).catch(() => ({ data: { data: 0 } })),
 api.get("/users/me").catch(() => ({ data: { data: { age: 30 } } })),
 ]);

 const companies: CompanyResponse[] = companiesRes.data.data.companies;
 const products: ProductResponse[] = productsRes.data.data.products;
 const safetyScore = scoreRes.score ?? null;
 const annualMileageKm: number = mileageRes.data.data ?? 0;
 const userAge: number = userRes.data.data.age ?? 30;

 // 최대 할인율: 안전점수 100점 기준으로 한 번만 조회
 let maxDiscountRate = 0;
 try {
 const maxCalcRes = await api.get("/insurance/discount-policies/calculate", {
 params: { age: userAge, score: 100, experienceYears: 0, annualMileageKm: 10000 },
 });
 maxDiscountRate = maxCalcRes.data.data.scoreDiscountRate ?? 0;
 } catch {
 maxDiscountRate = 0;
 }

 const activeInsurance = myInsurances.find(
 (i) => i.status === "ACTIVE" && i.userVehicleId === userVehicleId,
 ) ?? null;
 const activeContract = activeInsurance
 ? myContracts.find((c) => c.status === "ACTIVE" && c.id === activeInsurance.insuranceContractsId) ?? null
 : null;

 // 보험사별 비교 섹션: 각 상품의 BASIC 플랜 기준으로 estimatePremium 조회
 const activeCompanies = companies.filter((c) => c.status === "ACTIVE");
 const companyEstimates = await Promise.all(
 activeCompanies.map(async (c) => {
 const product = products.find(
 (p) => p.insuranceCompanyId === c.id && (p.status === "ON_SALE" || p.status === "ACTIVE"),
 );
 if (!product) return null;
 try {
 const res = await api.get(`/insurance/products/${product.id}/premium-estimate`, { params: { planType: "BASIC", userVehicleId: userVehicleId ?? undefined } });
 return { company: c, product, estimate: res.data.data };
 } catch {
 return null;
 }
 }),
 );

 const companyList: InsuranceCompany[] = companyEstimates
 .filter((e): e is NonNullable<typeof e> => e !== null)
 .map(({ company, product, estimate }) => ({
 id: product.id,
 name: company.companyName,
 logo: company.companyName.substring(0, 2),
 discountRate: Math.round(maxDiscountRate * 1000) / 10,
 basePremium: estimate.adjustedBase,
 expectedPremium: estimate.finalAmount,
 tags: ["기본형(실속형)", product.productName],
 reason: estimate.discountRate > 0
 ? `안전운전 할인 ${Math.round(estimate.discountRate * 100)}% 적용 중`
 : `안전점수 100점 달성 시 최대 ${Math.round(maxDiscountRate * 100)}% 할인 가능`,
 }));

 // 산출서: 가입된 보험 상품 + 플랜 기준으로 estimatePremium 조회
 let representativeAdjusted = 0;
 let representativeFinal = 0;
 let representativeDiscount = 0;
 let currentDiscountRate = 0;

 if (activeInsurance) {
 try {
 const estRes = await api.get(`/insurance/products/${activeInsurance.insuranceProductId}/premium-estimate`, {
 params: { planType: activeInsurance.planType, userVehicleId: activeInsurance.userVehicleId },
 });
 const est = estRes.data.data;
 representativeAdjusted = est.adjustedBase;
 representativeFinal = est.finalAmount;
 representativeDiscount = est.discountAmount;
 currentDiscountRate = est.discountRate;
 } catch {
 representativeFinal = activeInsurance.finalAmount;
 }
 } else if (products.length > 0) {
 try {
 const estRes = await api.get(`/insurance/products/${products[0].id}/premium-estimate`, {
 params: { planType: "BASIC" },
 });
 const est = estRes.data.data;
 representativeAdjusted = est.adjustedBase;
 representativeFinal = est.finalAmount;
 representativeDiscount = est.discountAmount;
 currentDiscountRate = est.discountRate;
 } catch {}
 }

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
 companyName: activeInsurance?.companyName ?? activeContract?.companyName ?? "가입된 보험 없음",
 renewalDday: activeContract?.endedAt
 ? Math.ceil((new Date(activeContract.endedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
 : 0,
 safetyScore,
 annualMileageKm,
 expectedPremium: representativeFinal,
 expectedDiscountRate: Math.round(currentDiscountRate * 1000) / 10,
 totalExpectedSavings: representativeDiscount,
 };

 const bill: InsuranceBill = {
 issuedAt: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }),
 contractNumber: activeContract ? `ED-${activeContract.id}` : `ED-${new Date().getFullYear()}-NEW`,
 basePremium: representativeAdjusted,
 discountItems: [
 {
 label: "안전운전 할인",
 amount: representativeDiscount,
 badge: safetyScore != null ? `${safetyScore}점 적용` : "조건 미충족",
 tone: "blue" as const,
 },
 ],
 totalDiscountRate: Math.round(currentDiscountRate * 1000) / 10,
 finalPremium: representativeFinal,
 productNameLabel: `${currentProductLabel} ${currentPlanLabel}`.trim(),
 };

 return {
 currentSummary,
 companies: companyList,
 bill,
 };
}
