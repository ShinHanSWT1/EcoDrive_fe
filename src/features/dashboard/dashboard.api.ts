import {
  getDrivingOverviewByVehicle,
  getRecentDrivingSessions,
} from "../driving/driving.api";
import { getInsuranceFactors, getMyInsurances } from "../insurance/insurance.api";
import type { DashboardData, InsurancePreviewItem } from "./dashboard.types";
import { getMyVehicles } from "../../shared/api/onboarding";
import { resolveRepresentativeVehicleId } from "../../shared/lib/vehicle";

export async function getDashboardData(): Promise<DashboardData> {
  const vehicles = await getMyVehicles().catch(() => []);
  const representativeVehicleId = resolveRepresentativeVehicleId(vehicles);

  const [{ score, carbon }, recentSessions, myInsurances] = await Promise.all([
    getDrivingOverviewByVehicle(representativeVehicleId),
    getRecentDrivingSessions(5, representativeVehicleId),
    getMyInsurances().catch(() => []),
  ]);

  const totalDistance = recentSessions.reduce(
    (sum, session) => sum + session.distanceKm,
    0,
  );
  const totalIdling = recentSessions.reduce(
    (sum, session) => sum + session.idlingTimeMinutes,
    0,
  );
  const today = new Date().toISOString().slice(0, 10);
  const todayEarnedPoints =
    carbon.snapshotDate === today ? (carbon.rewardPoint ?? 0) : 0;

  // 보험 데이터 조회
  let insurancePreviews: InsurancePreviewItem[] = [];
  let expectedPremium: number | null = null;
  let discountRate: number | null = null;
  let totalSavings: number | null = null;

  try {
    const { companies, products, calc } = await getInsuranceFactors(0, representativeVehicleId);
    const activeCompanies = companies.filter((c) => c.status === "ACTIVE");

    const activeInsurance = myInsurances.find(
      (insurance) =>
        insurance.status === "ACTIVE"
        && insurance.userVehicleId === representativeVehicleId,
    ) ?? null;

    insurancePreviews = activeCompanies.slice(0, 3).map((c) => {
      const companyProducts = products.filter(
        (p) => p.insuranceCompanyId === c.id && (p.status === "ON_SALE" || p.status === "ACTIVE")
      );
      
      // 가입된 보험사라면 실제 가입 정보를 우선 표시
      if (activeInsurance && activeInsurance.insuranceCompanyId === c.id) {
        return {
          name: c.companyName,
          discountRate: Math.round(calc.scoreDiscountRate * 1000) / 10,
          premium: activeInsurance.finalAmount,
        };
      }

      const BASIC_PLAN_MULTIPLIER = 0.8;
      const baseAmount = companyProducts.length > 0 ? companyProducts[0].baseAmount : 600_000;
      const adjustedPremium = Math.round(baseAmount * calc.ageFactor * calc.experienceFactor * BASIC_PLAN_MULTIPLIER);
      const premium = Math.round(adjustedPremium * (1 - calc.scoreDiscountRate));
      return {
        name: c.companyName,
        discountRate: Math.round(calc.scoreDiscountRate * 1000) / 10,
        premium,
      };
    });

    if (activeInsurance) {
      expectedPremium = activeInsurance.finalAmount;
      discountRate = Math.round(calc.scoreDiscountRate * 1000) / 10;
      
      // 가입 시 선택한 플랜 가중치 적용 (BASIC: 0.8, STANDARD: 1.0, PREMIUM: 1.3)
      const planMultipliers: Record<string, number> = { BASIC: 0.8, STANDARD: 1.0, PREMIUM: 1.3 };
      const planMultiplier = planMultipliers[activeInsurance.planType] || 1.0;
      
      // 가입 시 입력한 원금(baseAmount) 대비 할인액 계산
      const prod = products.find(p => p.id === activeInsurance.insuranceProductId);
      const base = prod?.baseAmount ?? 600_000;
      const adjusted = Math.round(base * calc.ageFactor * calc.experienceFactor * planMultiplier);
      totalSavings = adjusted - expectedPremium;
    } else if (insurancePreviews.length > 0) {
      expectedPremium = insurancePreviews[0].premium;
      discountRate = insurancePreviews[0].discountRate;
      const firstCompany = activeCompanies[0];
      const firstProducts = products.filter(
        (p) => p.insuranceCompanyId === firstCompany?.id && (p.status === "ON_SALE" || p.status === "ACTIVE")
      );
      const firstBase = firstProducts.length > 0 ? firstProducts[0].baseAmount : 600_000;
      const firstAdjusted = Math.round(firstBase * calc.ageFactor * calc.experienceFactor);
      totalSavings = firstAdjusted - expectedPremium;
    }
  } catch {
    // 보험 데이터 조회 실패 시 기본값 유지
  }

  return {
    totalSavings: totalSavings ?? 0,
    pointBalance: carbon.rewardPoint ?? 0,
    todayEarnedPoints,
    summaryNote:
      carbon.carbonReductionKg != null
        ? `정속 주행 비율이 높아 탄소 배출을 ${carbon.carbonReductionKg.toFixed(2)}kg 줄였습니다.`
        : "정속 주행 비율이 높아 탄소 배출을 -- 줄였습니다.",
    stats: [
      {
        id: "premium",
        label: "다음 갱신 시 예상 보험료",
        value: expectedPremium != null ? `${expectedPremium.toLocaleString()}원` : "--",
        subText:
          discountRate != null
            ? `안전점수 할인 ${discountRate}% 적용`
            : "지난달 대비 예상 할인율 --",
        tone: "dark",
      },
      {
        id: "discount",
        label: "현재 예상 할인율",
        value: discountRate != null ? `${discountRate}%` : "--",
        subText:
          totalSavings != null
            ? `현재까지 누적 예상 절감액 ${totalSavings.toLocaleString()}원`
            : "현재까지 누적 예상 절감액 --원",
        tone: "orange",
      },
      {
        id: "score",
        label: "안전운전 점수",
        value: `${score.score ?? 100}점`,
        subText: score.snapshotDate
          ? `기준일 ${score.snapshotDate}`
          : "온보딩 기본 점수 반영",
        tone: "blue",
      },
      {
        id: "carbon",
        label: "탄소 절감 성과",
        value: `${(carbon.carbonReductionKg ?? 0).toFixed(2)}kg CO₂`,
        subText: `적립 포인트 ${carbon.rewardPoint ?? 0}P`,
        tone: "green",
      },
    ],
    savingsChart: [],
    todayDrivingSummary: [
      {
        id: "distance",
        title: "최근 주행거리",
        description: `${totalDistance.toFixed(2)} km`,
        statusText: `${recentSessions.length}건`,
        statusTone: "normal",
        icon: "car",
      },
      {
        id: "idling",
        title: "최근 공회전 시간",
        description: `${totalIdling}분`,
        statusText: `${totalIdling}분`,
        statusTone: "normal",
        icon: "trendDown",
      },
    ],
    insurancePreviews,
  };
}
