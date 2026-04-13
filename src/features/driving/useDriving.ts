import { useEffect, useRef, useState } from "react";
import type { DrivingTab } from "./driving.types";
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
  buildAvailableMonthOptions,
  buildMonthlyHistory,
  buildMonthlySummaryData,
  buildWeeklySummaries,
  formatDailyData,
  formatDateKey,
  formatScoreHistoryItems,
  formatScoreTrendItems,
  formatYearMonthKey,
  getMonthWeekKey,
  getSelectedYearMonth,
  mergeBehaviorData,
  parseYearMonthKey,
  shiftYearMonth,
} from "./driving.mapper";

export function useDriving() {
  const todayKey = formatDateKey(new Date());
  const todayYearMonth = getSelectedYearMonth(todayKey);
  const todayMonthKey = formatYearMonthKey(
    todayYearMonth.year,
    todayYearMonth.month,
  );
  const currentWeekKey = getMonthWeekKey(todayKey);
  const hasInitializedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<DrivingTab>("history");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [selectedMonthKey, setSelectedMonthKey] = useState(todayMonthKey);
  const [selectedWeekKey, setSelectedWeekKey] = useState(currentWeekKey);
  const [latestScore, setLatestScore] = useState<DrivingLatestScore | null>(null);
  const [latestCarbon, setLatestCarbon] = useState<DrivingLatestCarbon | null>(
    null,
  );
  const [recentSessions, setRecentSessions] = useState<DrivingRecentSession[]>(
    [],
  );
  const [selectedDailySummary, setSelectedDailySummary] =
    useState<DrivingDailySummary | null>(null);
  const [selectedBehaviorSummary, setSelectedBehaviorSummary] =
    useState<DrivingBehaviorSummary | null>(null);
  const [weeklySummaryResponses, setWeeklySummaryResponses] = useState<
    DrivingWeeklySummary[]
  >([]);
  const [monthlySummary, setMonthlySummary] =
    useState<DrivingMonthlySummary | null>(null);
  const [monthlyHistoryResponses, setMonthlyHistoryResponses] = useState<
    DrivingMonthlySummary[]
  >([]);
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
      getRecentDrivingSessions(180),
      getDrivingScoreHistory(10),
    ]);

    setLatestScore(score);
    setLatestCarbon(carbon);
    setRecentSessions(sessions);
    setScoreHistoryResponses(scoreHistory);
  }

  async function fetchMonthScopedData(year: number, month: number) {
    const historyTargets = Array.from({ length: 6 }, (_, index) =>
      shiftYearMonth(year, month, index - 5),
    );

    const [weeklySummaries, monthly, scoreTrend, monthlyHistory] =
      await Promise.all([
        getDrivingWeeklySummaries(year, month),
        getDrivingMonthlySummary(year, month),
        getDrivingScoreTrend(year, month),
        Promise.all(
          historyTargets.map((target) =>
            getDrivingMonthlySummary(target.year, target.month),
          ),
        ),
      ]);

    setWeeklySummaryResponses(weeklySummaries);
    setMonthlySummary(monthly);
    setScoreTrendResponses(scoreTrend);
    setMonthlyHistoryResponses(monthlyHistory);
  }

  async function fetchSelectionDrivingData(date: string) {
    const [dailySummary, behaviorSummary] = await Promise.all([
      getDrivingDailySummary(date),
      getDrivingBehaviorSummary(date),
    ]);

    setSelectedDailySummary(dailySummary);
    setSelectedBehaviorSummary(behaviorSummary);
  }

  async function fetchDrivingData(date = selectedDate, monthKey = selectedMonthKey) {
    try {
      setIsError(false);
      const { year, month } = parseYearMonthKey(monthKey);
      await Promise.all([
        fetchBaseDrivingData(),
        fetchSelectionDrivingData(date),
        fetchMonthScopedData(year, month),
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
        await fetchDrivingData(todayKey, todayMonthKey);
        hasInitializedRef.current = true;
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || !hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchDailySelection() {
      try {
        const [dailySummary, behaviorSummary] = await Promise.all([
          getDrivingDailySummary(selectedDate),
          getDrivingBehaviorSummary(selectedDate),
        ]);

        if (!active) {
          return;
        }

        setSelectedDailySummary(dailySummary);
        setSelectedBehaviorSummary(behaviorSummary);
      } catch (error) {
        console.error("선택 기준 주행 요약 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchDailySelection();

    return () => {
      active = false;
    };
  }, [selectedDate, isLoading]);

  useEffect(() => {
    if (isLoading || !hasInitializedRef.current) {
      return;
    }

    const selectedDateYearMonth = getSelectedYearMonth(selectedDate);
    const dateMonthKey = formatYearMonthKey(
      selectedDateYearMonth.year,
      selectedDateYearMonth.month,
    );

    if (dateMonthKey !== selectedMonthKey) {
      setSelectedMonthKey(dateMonthKey);
    }
  }, [selectedDate, selectedMonthKey, isLoading]);

  useEffect(() => {
    if (isLoading || !hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchSelectedMonthData() {
      try {
        const { year, month } = parseYearMonthKey(selectedMonthKey);
        const historyTargets = Array.from({ length: 6 }, (_, index) =>
          shiftYearMonth(year, month, index - 5),
        );

        const [weeklySummaries, monthly, scoreTrend, monthlyHistory] =
          await Promise.all([
            getDrivingWeeklySummaries(year, month),
            getDrivingMonthlySummary(year, month),
            getDrivingScoreTrend(year, month),
            Promise.all(
              historyTargets.map((target) =>
                getDrivingMonthlySummary(target.year, target.month),
              ),
            ),
          ]);

        if (!active) {
          return;
        }

        setWeeklySummaryResponses(weeklySummaries);
        setMonthlySummary(monthly);
        setScoreTrendResponses(scoreTrend);
        setMonthlyHistoryResponses(monthlyHistory);
      } catch (error) {
        console.error("선택 월 주행 요약 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchSelectedMonthData();

    return () => {
      active = false;
    };
  }, [selectedMonthKey, isLoading]);

  useEffect(() => {
    const weeklyItems = buildWeeklySummaries(weeklySummaryResponses);
    if (weeklyItems.length === 0) {
      return;
    }

    const hasSelectedWeek = weeklyItems.some(
      (item) => item.weekKey === selectedWeekKey,
    );
    if (!hasSelectedWeek) {
      const latestWeekOfMonth = weeklyItems[weeklyItems.length - 1];
      setSelectedWeekKey(latestWeekOfMonth.weekKey);
    }
  }, [weeklySummaryResponses, selectedWeekKey]);

  async function refresh() {
    try {
      setIsRefreshing(true);
      await fetchDrivingData(selectedDate, selectedMonthKey);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function addDummyDrivingData() {
    try {
      setIsGeneratingDummyData(true);
      setIsError(false);
      await generateAndRefreshDummyDrivingData();
      await fetchDrivingData(selectedDate, selectedMonthKey);
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
  const availableMonthOptions = buildAvailableMonthOptions(recentSessions);
  const weeklySummaries = buildWeeklySummaries(weeklySummaryResponses);
  const selectedWeeklySummary =
    weeklySummaries.find((item) => item.weekKey === selectedWeekKey) ?? null;
  const selectedDailyData = mergeBehaviorData(
    formatDailyData(selectedDailySummary),
    selectedBehaviorSummary,
  );
  const monthlyHistory = buildMonthlyHistory(
    monthlyHistoryResponses,
    selectedMonthKey,
  );
  const monthlySummaryData = buildMonthlySummaryData(monthlySummary);

  return {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    goToToday: () => setSelectedDate(todayKey),
    todayKey,
    availableDateKeys,
    selectedMonthKey,
    setSelectedMonthKey,
    availableMonthOptions,
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
