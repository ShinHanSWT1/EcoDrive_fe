import { useEffect, useRef, useState } from "react";
import type {
  DrivingTab,
} from "./driving.types";
import {
  generateAndRefreshDummyDrivingData,
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
import {
  buildMonthlyHistory,
  buildMonthlySummaryData,
  buildWeeklySummaries,
  formatDailyData,
  formatDateKey,
  formatScoreHistoryItems,
  formatScoreTrendItems,
  getMonthWeekKey,
  getSelectedYearMonth,
  mergeBehaviorData,
} from "./driving.mapper";

export function useDriving() {
  const todayKey = formatDateKey(new Date());
  const currentWeekKey = getMonthWeekKey(todayKey);
  const hasInitializedRef = useRef(false);
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
  const [isGeneratingDummyData, setIsGeneratingDummyData] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchBaseDrivingData() {
    const [score, carbon, sessions, scoreHistory] = await Promise.all([
      getLatestDrivingScore(),
      getLatestDrivingCarbon(),
      getRecentDrivingSessions(20),
      getDrivingScoreHistory(10),
    ]);

    setLatestScore(score);
    setLatestCarbon(carbon);
    setRecentSessions(sessions);
    setScoreHistoryResponses(scoreHistory);
  }

  async function fetchMonthScopedData(date: string) {
    const { year, month } = getSelectedYearMonth(date);
    const [weeklySummaries, monthly, scoreTrend] = await Promise.all([
      getDrivingWeeklySummaries(year, month),
      getDrivingMonthlySummary(year, month),
      getDrivingScoreTrend(year, month),
    ]);

    setWeeklySummaryResponses(weeklySummaries);
    setMonthlySummary(monthly);
    setScoreTrendResponses(scoreTrend);
  }

  async function fetchSelectionDrivingData(date: string) {
    const [dailySummary, behaviorSummary] = await Promise.all([
      getDrivingDailySummary(date),
      getDrivingBehaviorSummary(date),
    ]);

    setSelectedDailySummary(dailySummary);
    setSelectedBehaviorSummary(behaviorSummary);
  }

  async function fetchDrivingData(date = selectedDate) {
    try {
      setIsError(false);
      await Promise.all([
        fetchBaseDrivingData(),
        fetchSelectionDrivingData(date),
        fetchMonthScopedData(date),
      ]);
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
        hasInitializedRef.current = true;
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
    if (isLoading || !hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchSummariesForSelection() {
      try {
        const selectedYearMonth = getSelectedYearMonth(selectedDate);
        const loadedYearMonth = monthlySummary
          ? { year: monthlySummary.year, month: monthlySummary.month }
          : null;
        const shouldRefreshMonthScoped =
          !loadedYearMonth ||
          loadedYearMonth.year !== selectedYearMonth.year ||
          loadedYearMonth.month !== selectedYearMonth.month;

        const [dailySummary, behaviorSummary] = await Promise.all([
          getDrivingDailySummary(selectedDate),
          getDrivingBehaviorSummary(selectedDate),
        ]);

        if (!active) {
          return;
        }

        setSelectedDailySummary(dailySummary);
        setSelectedBehaviorSummary(behaviorSummary);

        if (!shouldRefreshMonthScoped) {
          return;
        }

        const [weeklySummaries, monthly, scoreTrend] = await Promise.all([
          getDrivingWeeklySummaries(selectedYearMonth.year, selectedYearMonth.month),
          getDrivingMonthlySummary(selectedYearMonth.year, selectedYearMonth.month),
          getDrivingScoreTrend(selectedYearMonth.year, selectedYearMonth.month),
        ]);

        if (!active) {
          return;
        }

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
  }, [selectedDate, isLoading, monthlySummary]);

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

  async function addDummyDrivingData() {
    try {
      setIsGeneratingDummyData(true);
      setIsError(false);
      await generateAndRefreshDummyDrivingData();
      await fetchDrivingData(selectedDate);
    } catch (error) {
      console.error("더미 주행 데이터 생성 실패:", error);
      setIsError(true);
    } finally {
      setIsGeneratingDummyData(false);
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
    isGeneratingDummyData,
    isError,
    refresh,
    addDummyDrivingData,
  };
}
