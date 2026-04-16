import type {
  DailyDrivingData,
  MonthOption,
  ScoreChangeListItem,
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
  DrivingRecentSession,
  DrivingWeeklySummary,
} from "./driving.api";

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseCalendarDate(dateValue: string) {
  const matched = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (matched) {
    return {
      year: Number(matched[1]),
      month: Number(matched[2]),
      day: Number(matched[3]),
    };
  }

  const date = new Date(dateValue);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function getMonthWeekKey(dateValue: string): string {
  const { year, month, day } = parseCalendarDate(dateValue);
  const week = Math.ceil(day / 7);
  return `${year}-${String(month).padStart(2, "0")}-${week}`;
}

export function getSelectedYearMonth(dateValue: string) {
  const { year, month } = parseCalendarDate(dateValue);
  return {
    year,
    month,
  };
}

export function formatYearMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseYearMonthKey(yearMonthKey: string) {
  const [year, month] = yearMonthKey.split("-").map(Number);
  return { year, month };
}

export function shiftYearMonth(
  year: number,
  month: number,
  offset: number,
) {
  const date = new Date(year, month - 1 + offset, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function buildAvailableMonthOptions(
  sessions: DrivingRecentSession[],
): MonthOption[] {
  return Array.from(
    new Set(
      sessions.map((session) => {
        const { year, month } = getSelectedYearMonth(session.sessionDate);
        return formatYearMonthKey(year, month);
      }),
    ),
  )
    .sort((a, b) => b.localeCompare(a))
    .map((yearMonthKey) => {
      const { year, month } = parseYearMonthKey(yearMonthKey);
      return {
        key: yearMonthKey,
        label: `${year}년 ${month}월`,
      };
    });
}

export function buildRollingMonthOptions(
  referenceDate: string,
  months: number,
): MonthOption[] {
  const { year, month } = getSelectedYearMonth(referenceDate);

  return Array.from({ length: months }, (_, index) => {
    const target = shiftYearMonth(year, month, -index);
    return {
      key: formatYearMonthKey(target.year, target.month),
      label: `${target.year}년 ${target.month}월`,
    };
  });
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
  summaries: DrivingMonthlySummary[],
  selectedYearMonthKey: string,
): MonthlyHistoryItem[] {
  return summaries.map((summary) => ({
    yearMonthKey: formatYearMonthKey(summary.year, summary.month),
    month: `${summary.month}월`,
    distance: Number(summary.totalDistanceKm.toFixed(2)),
    isSelected:
      formatYearMonthKey(summary.year, summary.month) === selectedYearMonthKey,
  }));
}

export function buildWeeklySummaries(
  summaries: DrivingWeeklySummary[],
): WeeklySummaryItem[] {
  return summaries
    .map((summary) => ({
      startDate: summary.startDate,
      endDate: summary.endDate,
      totalDistance:
        summary.totalDistanceKm != null
          ? `${summary.totalDistanceKm.toFixed(2)}km`
          : "0.00km",
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
  return items.map((item, index) => ({
    fullDate: item.snapshotDate,
    date: item.snapshotDate.slice(5),
    score: item.score,
    deltaFromPrevious:
      index === 0 ? item.score - 100 : item.score - items[index - 1].score,
  }));
}

export function buildScoreChangeListItems(
  trendItems: {
    fullDate: string;
    date: string;
    score: number;
    deltaFromPrevious: number | null;
  }[],
  behaviorsByDate: Record<string, DrivingBehaviorSummary | null>,
  todayKey: string,
): ScoreChangeListItem[] {
  return [...trendItems]
    .sort((a, b) => b.fullDate.localeCompare(a.fullDate))
    .map((item) => ({
      fullDate: item.fullDate,
      dateLabel: item.fullDate === todayKey ? `오늘 ${item.date}` : item.date,
      score: item.score,
      deltaFromPrevious: item.deltaFromPrevious,
      summary: buildScoreChangeSummary(behaviorsByDate[item.fullDate]),
      isToday: item.fullDate === todayKey,
    }));
}

function buildScoreChangeSummary(
  behavior: DrivingBehaviorSummary | null | undefined,
) {
  if (!behavior) {
    return "점수 변화 원인을 확인할 수 있는 주행 데이터가 없습니다.";
  }

  const parts: string[] = [];

  if (behavior.rapidAccelCount > 0) {
    parts.push(`급가속 ${behavior.rapidAccelCount}회`);
  }
  if (behavior.hardBrakeCount > 0) {
    parts.push(`급감속 ${behavior.hardBrakeCount}회`);
  }
  if (behavior.overspeedCount > 0) {
    parts.push(`과속 ${behavior.overspeedCount}회`);
  }
  if (behavior.nightDrivingCount > 0) {
    parts.push(`심야운전 ${behavior.nightDrivingCount}회`);
  }
  if (behavior.totalIdlingTimeMinutes > 0) {
    parts.push(`공회전 ${behavior.totalIdlingTimeMinutes}분`);
  }

  if (parts.length === 0) {
    return "위험 운전 지표 없음";
  }

  return parts.join(" · ");
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
