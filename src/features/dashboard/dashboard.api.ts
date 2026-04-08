import {
  getLatestDrivingCarbon,
  getLatestDrivingScore,
  getRecentDrivingSessions,
} from "../driving/driving.api";
import type { DashboardData } from "./dashboard.types";

export async function getDashboardData(): Promise<DashboardData> {
  const [score, carbon, recentSessions] = await Promise.all([
    getLatestDrivingScore(),
    getLatestDrivingCarbon(),
    getRecentDrivingSessions(5),
  ]);

  const totalDistance = recentSessions.reduce(
    (sum, session) => sum + session.distanceKm,
    0,
  );
  const totalIdling = recentSessions.reduce(
    (sum, session) => sum + session.idlingTimeMinutes,
    0,
  );

  return {
    totalSavings: 0,
    pointBalance: carbon.rewardPoint ?? 0,
    expectedWeeklyPoints: 0,
    summaryNote:
      carbon.carbonReductionKg != null
        ? `정속 주행 비율이 높아 탄소 배출을 ${carbon.carbonReductionKg.toFixed(2)}kg 줄였습니다.`
        : "정속 주행 비율이 높아 탄소 배출을 -- 줄였습니다.",
    stats: [
      {
        id: "premium",
        label: "다음 갱신 시 예상 보험료",
        value: "--",
        subText: "지난달 대비 예상 할인율 --",
        tone: "dark",
      },
      {
        id: "discount",
        label: "현재 예상 할인율",
        value: "--",
        subText: "현재까지 누적 예상 절감액 --원",
        tone: "orange",
      },
      {
        id: "score",
        label: "안전운전 점수",
        value: score.score != null ? `${score.score}점` : "--",
        subText: score.snapshotDate
          ? `기준일 ${score.snapshotDate}`
          : "최근 기준 점수 상승",
        tone: "blue",
      },
      {
        id: "carbon",
        label: "탄소 절감 성과",
        value:
          carbon.carbonReductionKg != null
            ? `${carbon.carbonReductionKg.toFixed(2)}kg CO₂`
            : "--",
        subText:
          carbon.rewardPoint != null
            ? `적립 포인트 ${carbon.rewardPoint}P`
            : "친환경 주행 실천 중",
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
        description: "--",
        statusText: `${totalIdling}분`,
        statusTone: "normal",
        icon: "trendDown",
      },
    ],
    insurancePreviews: [],
  };
}
