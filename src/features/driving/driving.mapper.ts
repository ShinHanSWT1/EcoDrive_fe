import type {
  DailyDrivingData,
  MonthlyHistoryItem,
  MonthlySummaryData,
  WeeklySummaryItem,
} from "./driving.types";
import type {
  DrivingBehaviorSummary,
  DrivingDailySummary,
  DrivingMonthlySummary,
  DrivingScoreHistoryResponse,
  DrivingScoreTrendResponse,
  DrivingWeeklySummary,
} from "./driving.api";

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMonthWeekKey(dateValue: string): string {
  const date = new Date(dateValue);
  const month = date.getMonth() + 1;
  const week = Math.ceil(date.getDate() / 7);
  return `${date.getFullYear()}-${String(month).padStart(2, "0")}-${week}`;
}

export function getSelectedYearMonth(dateValue: string) {
  const date = new Date(dateValue);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function getEmptyDailyData(): DailyDrivingData {
  return {
    totalDistance: "0.00km",
    idling: "0분",
    avgSpeed: "0.00km/h",
    maxSpeed: "0.00km/h",
    accel: 0,
    decel: 0,
    start: 0,
    night: "0회",
    idlingTime: "0분",
  };
}

export function mergeBehaviorData(
  dailyData: DailyDrivingData,
  behavior: DrivingBehaviorSummary | null,
): DailyDrivingData {
  if (!behavior) {
    return dailyData;
  }

  return {
    ...dailyData,
    accel: behavior.rapidAccelCount,
    decel: behavior.hardBrakeCount,
    start: behavior.overspeedCount,
    night: `${behavior.nightDrivingCount}회`,
    idlingTime: `${behavior.totalIdlingTimeMinutes}분`,
  };
}

export function formatDailyData(
  summary: DrivingDailySummary | null,
): DailyDrivingData {
  if (!summary || summary.sessionCount === 0) {
    return getEmptyDailyData();
  }

  return {
    totalDistance:
      summary.totalDistanceKm != null
        ? `${summary.totalDistanceKm.toFixed(2)}km`
        : null,
    idling:
      summary.totalIdlingTimeMinutes != null
        ? `${summary.totalIdlingTimeMinutes}분`
        : null,
    avgSpeed:
      summary.averageSpeed != null ? `${summary.averageSpeed.toFixed(2)}km/h` : null,
    maxSpeed:
      summary.maxSpeed != null ? `${summary.maxSpeed.toFixed(2)}km/h` : null,
    accel: summary.rapidAccelCount,
    decel: summary.hardBrakeCount,
    start: summary.overspeedCount,
    night: null,
    idlingTime:
      summary.totalIdlingTimeMinutes != null
        ? `${summary.totalIdlingTimeMinutes}분`
        : null,
  };
}

export function buildMonthlyHistory(
  summary: DrivingMonthlySummary | null,
): MonthlyHistoryItem[] {
  if (!summary || summary.sessionCount === 0) {
    return [];
  }

  return [
    {
      month: `${summary.month}월`,
      distance: Number(summary.totalDistanceKm.toFixed(2)),
    },
  ];
}

export function buildWeeklySummaries(
  summaries: DrivingWeeklySummary[],
): WeeklySummaryItem[] {
  return summaries
    .map((summary) => ({
      weekKey: `${summary.year}-${String(summary.month).padStart(2, "0")}-${summary.weekOfMonth}`,
      label: summary.label,
      averageDistance:
        summary.averageDistanceKm != null
          ? `${summary.averageDistanceKm.toFixed(2)}km`
          : "0.00km",
      averageIdling:
        summary.averageIdlingTimeMinutes != null
          ? `${summary.averageIdlingTimeMinutes.toFixed(0)}분`
          : "0분",
      averageSpeed:
        summary.averageSpeed != null
          ? `${summary.averageSpeed.toFixed(2)}km/h`
          : "0.00km/h",
      maxSpeed:
        summary.maxSpeed != null ? `${summary.maxSpeed.toFixed(2)}km/h` : "0.00km/h",
    }))
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));
}

export function buildMonthlySummaryData(
  summary: DrivingMonthlySummary | null,
): MonthlySummaryData | null {
  if (!summary || summary.sessionCount === 0) {
    return null;
  }

  return {
    label: `${summary.month}월`,
    totalDistance: `${summary.totalDistanceKm.toFixed(2)}km`,
    sessionCount: summary.sessionCount,
    dayCount: summary.dayCount,
  };
}

export function formatScoreTrendItems(items: DrivingScoreTrendResponse[]) {
  return items.map((item) => ({
    date: item.snapshotDate.slice(5),
    score: item.score,
  }));
}

export function formatScoreHistoryItems(items: DrivingScoreHistoryResponse[]) {
  return items.map((item) => ({
    id: item.id,
    type: (item.scoreDelta ?? 0) >= 0 ? ("up" as const) : ("down" as const),
    change: Math.abs(item.scoreDelta ?? 0),
    reason: item.message ?? item.changeType,
    date: item.changeDate,
  }));
}
