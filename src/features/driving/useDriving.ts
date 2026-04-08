import { useEffect, useState } from "react";
import type {
  DailyDrivingData,
  DrivingTab,
  MonthlyHistoryItem,
  MonthlySummaryData,
  WeeklySummaryItem,
} from "./driving.types";
import {
  getDrivingBehaviorSummary,
  getDrivingDailySummary,
  getDrivingMonthlySummary,
  getDrivingScoreHistory,
  getDrivingScoreTrend,
  getDrivingWeeklySummaries,
  getLatestDrivingCarbon,
  getLatestDrivingScore,
  getRecentDrivingSessions,
  type DrivingBehaviorSummary,
  type DrivingDailySummary,
  type DrivingLatestCarbon,
  type DrivingLatestScore,
  type DrivingMonthlySummary,
  type DrivingRecentSession,
  type DrivingScoreHistoryResponse,
  type DrivingScoreTrendResponse,
  type DrivingWeeklySummary,
} from "./driving.api";

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthWeekKey(dateValue: string): string {
  const date = new Date(dateValue);
  const month = date.getMonth() + 1;
  const week = Math.ceil(date.getDate() / 7);
  return `${date.getFullYear()}-${String(month).padStart(2, "0")}-${week}`;
}

function getEmptyDailyData(): DailyDrivingData {
  return {
    totalDistance: null,
    idling: null,
    avgSpeed: null,
    maxSpeed: null,
    accel: null,
    decel: null,
    start: null,
    night: null,
    idlingTime: null,
  };
}

function mergeBehaviorData(
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

function formatDailyData(summary: DrivingDailySummary | null): DailyDrivingData {
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

function buildMonthlyHistory(
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

function buildWeeklySummaries(
  summaries: DrivingWeeklySummary[],
): WeeklySummaryItem[] {
  return summaries
    .map((summary) => ({
      weekKey: `${summary.year}-${String(summary.month).padStart(2, "0")}-${summary.weekOfMonth}`,
      label: summary.label,
      averageDistance:
        summary.averageDistanceKm != null
          ? `${summary.averageDistanceKm.toFixed(2)}km`
          : "--",
      averageIdling:
        summary.averageIdlingTimeMinutes != null
          ? `${summary.averageIdlingTimeMinutes.toFixed(0)}분`
          : "--",
      averageSpeed:
        summary.averageSpeed != null
          ? `${summary.averageSpeed.toFixed(2)}km/h`
          : "--",
      maxSpeed:
        summary.maxSpeed != null ? `${summary.maxSpeed.toFixed(2)}km/h` : "--",
    }))
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));
}

function buildMonthlySummaryData(
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

function formatScoreTrendItems(items: DrivingScoreTrendResponse[]) {
  return items.map((item) => ({
    date: item.snapshotDate.slice(5),
    score: item.score,
  }));
}

function formatScoreHistoryItems(items: DrivingScoreHistoryResponse[]) {
  return items.map((item) => ({
    id: item.id,
    type: (item.scoreDelta ?? 0) >= 0 ? ("up" as const) : ("down" as const),
    change: Math.abs(item.scoreDelta ?? 0),
    reason: item.message ?? item.changeType,
    date: item.changeDate,
  }));
}

export function useDriving() {
  const todayKey = formatDateKey(new Date());
  const currentWeekKey = getMonthWeekKey(todayKey);
  const [activeTab, setActiveTab] = useState<DrivingTab>("history");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [selectedWeekKey, setSelectedWeekKey] = useState(currentWeekKey);
  const [latestScore, setLatestScore] = useState<DrivingLatestScore | null>(null);
  const [latestCarbon, setLatestCarbon] = useState<DrivingLatestCarbon | null>(null);
  const [recentSessions, setRecentSessions] = useState<DrivingRecentSession[]>([]);
  const [selectedDailySummary, setSelectedDailySummary] =
    useState<DrivingDailySummary | null>(null);
  const [selectedBehaviorSummary, setSelectedBehaviorSummary] =
    useState<DrivingBehaviorSummary | null>(null);
  const [weeklySummaryResponses, setWeeklySummaryResponses] = useState<
    DrivingWeeklySummary[]
  >([]);
  const [monthlySummary, setMonthlySummary] =
    useState<DrivingMonthlySummary | null>(null);
  const [scoreTrendResponses, setScoreTrendResponses] = useState<
    DrivingScoreTrendResponse[]
  >([]);
  const [scoreHistoryResponses, setScoreHistoryResponses] = useState<
    DrivingScoreHistoryResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  function getSelectedYearMonth() {
    const date = new Date(selectedDate);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    };
  }

  async function fetchDrivingData(date = selectedDate) {
    try {
      setIsError(false);
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1;
      const [
        score,
        carbon,
        sessions,
        dailySummary,
        behaviorSummary,
        weeklySummaries,
        monthly,
        scoreTrend,
        scoreHistory,
      ] =
        await Promise.all([
        getLatestDrivingScore(),
        getLatestDrivingCarbon(),
        getRecentDrivingSessions(20),
        getDrivingDailySummary(date),
        getDrivingBehaviorSummary(date),
        getDrivingWeeklySummaries(year, month),
        getDrivingMonthlySummary(year, month),
        getDrivingScoreTrend(year, month),
        getDrivingScoreHistory(10),
      ]);

      setLatestScore(score);
      setLatestCarbon(carbon);
      setRecentSessions(sessions);
      setSelectedDailySummary(dailySummary);
      setSelectedBehaviorSummary(behaviorSummary);
      setWeeklySummaryResponses(weeklySummaries);
      setMonthlySummary(monthly);
      setScoreTrendResponses(scoreTrend);
      setScoreHistoryResponses(scoreHistory);
    } catch (error) {
      console.error("주행 데이터 조회 실패:", error);
      setIsError(true);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setIsLoading(true);
        await fetchDrivingData(todayKey);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let active = true;

    async function fetchSummariesForSelection() {
      try {
        const { year, month } = getSelectedYearMonth();
        const [dailySummary, behaviorSummary, weeklySummaries, monthly, scoreTrend] = await Promise.all([
          getDrivingDailySummary(selectedDate),
          getDrivingBehaviorSummary(selectedDate),
          getDrivingWeeklySummaries(year, month),
          getDrivingMonthlySummary(year, month),
          getDrivingScoreTrend(year, month),
        ]);

        if (!active) {
          return;
        }

        setSelectedDailySummary(dailySummary);
        setSelectedBehaviorSummary(behaviorSummary);
        setWeeklySummaryResponses(weeklySummaries);
        setMonthlySummary(monthly);
        setScoreTrendResponses(scoreTrend);
      } catch (error) {
        console.error("선택 기준 주행 요약 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchSummariesForSelection();

    return () => {
      active = false;
    };
  }, [selectedDate, isLoading]);

  useEffect(() => {
    const weeklyItems = buildWeeklySummaries(weeklySummaryResponses);
    if (weeklyItems.length === 0) {
      return;
    }

    const hasSelectedWeek = weeklyItems.some((item) => item.weekKey === selectedWeekKey);
    if (!hasSelectedWeek) {
      const selectedDateWeekKey = getMonthWeekKey(selectedDate);
      const matchingWeek = weeklyItems.find((item) => item.weekKey === selectedDateWeekKey);
      setSelectedWeekKey(matchingWeek?.weekKey ?? weeklyItems[0].weekKey);
    }
  }, [weeklySummaryResponses, selectedWeekKey, selectedDate]);

  async function refresh() {
    try {
      setIsRefreshing(true);
      await fetchDrivingData(selectedDate);
    } finally {
      setIsRefreshing(false);
    }
  }

  const availableDateKeys = Array.from(
    new Set(recentSessions.map((session) => session.sessionDate)),
  ).sort((a, b) => a.localeCompare(b));
  const weeklySummaries = buildWeeklySummaries(weeklySummaryResponses);
  const selectedWeeklySummary =
    weeklySummaries.find((item) => item.weekKey === selectedWeekKey) ?? null;
  const selectedDailyData = mergeBehaviorData(
    formatDailyData(selectedDailySummary),
    selectedBehaviorSummary,
  );
  const monthlyHistory = buildMonthlyHistory(monthlySummary);
  const monthlySummaryData = buildMonthlySummaryData(monthlySummary);

  return {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    goToToday: () => setSelectedDate(todayKey),
    todayKey,
    availableDateKeys,
    selectedWeekKey,
    setSelectedWeekKey,
    latestScore,
    latestCarbon,
    recentSessions,
    selectedDailyData,
    weeklySummaries,
    selectedWeeklySummary,
    monthlyHistory,
    monthlySummaryData,
    monthlySummary,
    scoreTrend: formatScoreTrendItems(scoreTrendResponses),
    scoreHistory: formatScoreHistoryItems(scoreHistoryResponses),
    isLoading,
    isRefreshing,
    isError,
    refresh,
  };
}
