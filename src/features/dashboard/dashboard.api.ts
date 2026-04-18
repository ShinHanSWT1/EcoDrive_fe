import {
  getDrivingOverviewByVehicle,
  getDrivingWeeklySummaries,
  getRecentDrivingSessions,
} from "../driving/driving.api";
import { getInsuranceFactors, getMyInsurances } from "../insurance/insurance.api";
import { getMyWalletSummary } from "../payment/payment.api";
import type { DashboardData, InsurancePreviewItem } from "./dashboard.types";
import { getMyVehicles } from "../../shared/api/onboarding";
import { resolveRepresentativeVehicleId } from "../../shared/lib/vehicle";

const BASIC_PLAN_MULTIPLIER = 0.8;
const PLAN_MULTIPLIERS: Record<string, number> = {
  BASIC: 0.8,
  STANDARD: 1.0,
  PREMIUM: 1.3,
};

function roundDiscountRate(rate: number | null | undefined): number {
  return Math.round((rate ?? 0) * 1000) / 10;
}

function buildWeeklySavingsChart(
  weeklySummaries: Array<{ label: string; weekOfMonth: number; totalDistanceKm: number | null }>,
  totalSavings: number,
) {
  const recent4Weeks = [...weeklySummaries]
    .sort((a, b) => a.weekOfMonth - b.weekOfMonth)
    .slice(-4);

  if (recent4Weeks.length === 0) {
    return [] as Array<{ name: string; savings: number }>;
  }

  const distanceTotal = recent4Weeks.reduce(
    (sum, week) => sum + (week.totalDistanceKm ?? 0),
    0,
  );

  // 거리 데이터가 없으면 주차 순번 기준으로 균등 분배
  const fallbackUnit = recent4Weeks.length > 0
    ? Math.max(0, Math.round(totalSavings / recent4Weeks.length))
    : 0;

  let cumulative = 0;
  return recent4Weeks.map((week) => {
    const weeklySavings = distanceTotal > 0
      ? Math.max(0, Math.round(totalSavings * ((week.totalDistanceKm ?? 0) / distanceTotal)))
      : fallbackUnit;

    cumulative += weeklySavings;

    return {
      name: week.label || `${week.weekOfMonth}주`,
      savings: cumulative,
    };
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  const vehicles = await getMyVehicles().catch(() => []);
  const representativeVehicleId = resolveRepresentativeVehicleId(vehicles);

  // 대표차량이 없으면 범위 없는 조회를 하지 않고 빈 상태를 반환
  if (!representativeVehicleId) {
    return {
      totalSavings: 0,
      pointBalance: 0,
      todayEarnedPoints: 0,
      summaryNote: "대표 차량 정보를 찾을 수 없습니다.",
      stats: [
        {
          id: "premium",
          label: "다음 갱신 시 예상 보험료",
          value: "--",
          subText: "대표 차량을 등록하면 계산됩니다.",
          tone: "dark",
        },
        {
          id: "discount",
          label: "현재 예상 할인율",
          value: "--",
          subText: "대표 차량을 등록하면 계산됩니다.",
          tone: "orange",
        },
        {
          id: "score",
          label: "안전운전 점수",
          value: "--",
          subText: "대표 차량을 등록하면 계산됩니다.",
          tone: "blue",
        },
        {
          id: "carbon",
          label: "탄소 절감 효과",
          value: "--",
          subText: "대표 차량을 등록하면 계산됩니다.",
          tone: "green",
        },
      ],
      savingsChart: [],
      todayDrivingSummary: [
        {
          id: "distance",
          title: "최근 주행거리",
          description: "--",
          statusText: "0건",
          statusTone: "normal",
          icon: "car",
        },
        {
          id: "idling",
          title: "최근 공회전 시간",
          description: "--",
          statusText: "--",
          statusTone: "normal",
          icon: "trendDown",
        },
      ],
      insurancePreviews: [],
    };
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [
    { score, carbon },
    recentSessions,
    myInsurances,
    weeklySummaries,
    walletSummary,
  ] = await Promise.all([
    getDrivingOverviewByVehicle(representativeVehicleId),
    getRecentDrivingSessions(20, representativeVehicleId),
    getMyInsurances().catch(() => []),
    getDrivingWeeklySummaries(year, month, representativeVehicleId).catch(() => []),
    getMyWalletSummary().catch(() => null),
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

  let insurancePreviews: InsurancePreviewItem[] = [];
  let expectedPremium: number | null = null;
  let discountRate: number | null = null;
  let totalSavings: number = 0;

  try {
    const { companies, products, calc } = await getInsuranceFactors(
      0,
      Math.round(totalDistance),
      representativeVehicleId,
    );

    const activeCompanies = companies.filter((company) => company.status === "ACTIVE");

    const activeInsurance = myInsurances.find(
      (insurance) =>
        insurance.status === "ACTIVE"
        && insurance.userVehicleId === representativeVehicleId,
    ) ?? null;

    insurancePreviews = activeCompanies.slice(0, 3).map((company) => {
      const companyProducts = products.filter(
        (product) =>
          product.insuranceCompanyId === company.id
          && (product.status === "ON_SALE" || product.status === "ACTIVE"),
      );

      if (activeInsurance && activeInsurance.insuranceCompanyId === company.id) {
        return {
          name: company.companyName,
          discountRate: roundDiscountRate(calc.scoreDiscountRate),
          premium: activeInsurance.finalAmount,
        };
      }

      const baseAmount = companyProducts[0]?.baseAmount ?? 600_000;
      const adjustedPremium = Math.round(
        baseAmount
          * (calc.ageFactor || 1.0)
          * (calc.experienceFactor || 1.0)
          * BASIC_PLAN_MULTIPLIER,
      );
      const premium = Math.round(adjustedPremium * (1 - (calc.scoreDiscountRate || 0)));

      return {
        name: company.companyName,
        discountRate: roundDiscountRate(calc.scoreDiscountRate),
        premium,
      };
    });

    discountRate = roundDiscountRate(calc.scoreDiscountRate);

    if (activeInsurance) {
      expectedPremium = activeInsurance.finalAmount;

      const product = products.find((item) => item.id === activeInsurance.insuranceProductId);
      const baseAmount = product?.baseAmount ?? 600_000;
      const planMultiplier = PLAN_MULTIPLIERS[activeInsurance.planType] ?? 1.0;

      const adjustedPremium = Math.round(
        baseAmount * (calc.ageFactor || 1.0) * (calc.experienceFactor || 1.0) * planMultiplier,
      );
      totalSavings = Math.max(0, adjustedPremium - expectedPremium);
    } else if (insurancePreviews.length > 0) {
      expectedPremium = insurancePreviews[0].premium;

      const firstCompany = activeCompanies[0];
      const firstProduct = products.find(
        (item) =>
          item.insuranceCompanyId === firstCompany?.id
          && (item.status === "ON_SALE" || item.status === "ACTIVE"),
      );
      const baseAmount = firstProduct?.baseAmount ?? 600_000;

      const adjustedPremium = Math.round(
        baseAmount * (calc.ageFactor || 1.0) * (calc.experienceFactor || 1.0),
      );
      totalSavings = Math.max(0, adjustedPremium - expectedPremium);
    }
  } catch (error) {
    console.warn("[대시보드] 보험 데이터 조회 실패", error);
  }

  const savingsChart = buildWeeklySavingsChart(weeklySummaries, totalSavings);

  return {
    totalSavings,
    pointBalance: walletSummary?.points ?? (carbon.rewardPoint ?? 0),
    todayEarnedPoints,
    summaryNote:
      carbon.carbonReductionKg != null
        ? `친환경 운전으로 탄소 배출을 ${carbon.carbonReductionKg.toFixed(2)}kg 줄였습니다.`
        : "친환경 운전 데이터가 아직 충분하지 않습니다.",
    stats: [
      {
        id: "premium",
        label: "다음 갱신 시 예상 보험료",
        value: expectedPremium != null ? `${expectedPremium.toLocaleString("ko-KR")}원` : "--",
        subText:
          discountRate != null
            ? `안전점수 할인 ${discountRate}% 적용`
            : "보험 할인율 정보를 계산 중입니다.",
        tone: "dark",
      },
      {
        id: "discount",
        label: "현재 예상 할인율",
        value: discountRate != null ? `${discountRate}%` : "--",
        subText:
          totalSavings > 0
            ? `현재까지 누적 예상 절감액 ${totalSavings.toLocaleString("ko-KR")}원`
            : "누적 예상 절감액 데이터가 없습니다.",
        tone: "orange",
      },
      {
        id: "score",
        label: "안전운전 점수",
        value: `${score.score ?? 100}점`,
        subText: score.snapshotDate
          ? `기준일 ${score.snapshotDate}`
          : "기본 점수(100점) 기준",
        tone: "blue",
      },
      {
        id: "carbon",
        label: "탄소 절감 효과",
        value: `${(carbon.carbonReductionKg ?? 0).toFixed(2)}kg CO₂`,
        subText: `적립 포인트 ${todayEarnedPoints.toLocaleString("ko-KR")}P`,
        tone: "green",
      },
    ],
    savingsChart,
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
        statusTone: totalIdling >= 15 ? "danger" : "normal",
        icon: "trendDown",
      },
    ],
    insurancePreviews,
  };
}
