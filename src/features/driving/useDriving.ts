import { useEffect, useRef, useState } from "react";
import type { DrivingTab } from "./driving.types";
import {
  generateAndRefreshDummyDrivingDataForVehicle,
  getDrivingBehaviorSummary,
  getDrivingDailySummary,
  getDrivingMonthlySummary,
  getDrivingOverviewByVehicle,
  getDrivingScoreTrend,
  getDrivingWeeklySummaries,
  getRecentDrivingSessions,
  type DrivingBehaviorSummary,
  type DrivingDailySummary,
  type DrivingLatestCarbon,
  type DrivingLatestScore,
  type DrivingMonthlySummary,
  type DrivingRecentSession,
  type DrivingScoreTrendResponse,
  type DrivingWeeklySummary,
} from "./driving.api";
import {
  buildAvailableMonthOptions,
  buildMonthlyHistory,
  buildMonthlySummaryData,
  buildRollingMonthOptions,
  buildScoreChangeListItems,
  buildWeeklySummaries,
  formatDailyData,
  formatDateKey,
  formatScoreTrendItems,
  formatYearMonthKey,
  getMonthWeekKey,
  getSelectedYearMonth,
  mergeBehaviorData,
  parseYearMonthKey,
  shiftYearMonth,
} from "./driving.mapper";

const HISTORY_MONTH_SPAN = 6;
const SCORE_SECTION_MONTH_SPAN = 6;
const RECENT_SESSION_LIMIT = 180;

export function useDriving(userVehicleId: number | null) {
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

  const [scoreSectionMonthKey, setScoreSectionMonthKey] =
    useState(todayMonthKey);

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
  const [scoreSectionTrendResponses, setScoreSectionTrendResponses] = useState<
    DrivingScoreTrendResponse[]
  >([]);
  const [scoreSectionBehaviorsByDate, setScoreSectionBehaviorsByDate] =
    useState<Record<string, DrivingBehaviorSummary | null>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingDummyData, setIsGeneratingDummyData] = useState(false);
  const [isError, setIsError] = useState(false);

  async function loadBaseDrivingData() {
    const [{ score, carbon }, recentSessionResponses] =
      await Promise.all([
        getDrivingOverviewByVehicle(userVehicleId),
        getRecentDrivingSessions(RECENT_SESSION_LIMIT, userVehicleId),
      ]);

    return {
      latestScore: score,
      latestCarbon: carbon,
      recentSessions: recentSessionResponses,
    };
  }

  function applyBaseDrivingData(data: {
    latestScore: DrivingLatestScore | null;
    latestCarbon: DrivingLatestCarbon | null;
    recentSessions: DrivingRecentSession[];
  }) {
    setLatestScore(data.latestScore);
    setLatestCarbon(data.latestCarbon);
    setRecentSessions(data.recentSessions);
  }

  async function loadHistoryMonthData(year: number, month: number) {
    const historyTargets = Array.from({ length: HISTORY_MONTH_SPAN }, (_, index) =>
      shiftYearMonth(year, month, index - (HISTORY_MONTH_SPAN - 1)),
    );

    const [weeklySummaryResponses, monthlySummaryResponse, monthlyHistoryResponses] =
      await Promise.all([
      getDrivingWeeklySummaries(year, month, userVehicleId),
      getDrivingMonthlySummary(year, month, userVehicleId),
      Promise.all(
        historyTargets.map((target) =>
          getDrivingMonthlySummary(target.year, target.month, userVehicleId),
        ),
      ),
    ]);

    return {
      weeklySummaryResponses,
      monthlySummary: monthlySummaryResponse,
      monthlyHistoryResponses,
    };
  }

  function applyHistoryMonthData(data: {
    weeklySummaryResponses: DrivingWeeklySummary[];
    monthlySummary: DrivingMonthlySummary | null;
    monthlyHistoryResponses: DrivingMonthlySummary[];
  }) {
    setWeeklySummaryResponses(data.weeklySummaryResponses);
    setMonthlySummary(data.monthlySummary);
    setMonthlyHistoryResponses(data.monthlyHistoryResponses);
  }

  async function loadHistorySelection(date: string) {
    const [dailySummary, behaviorSummary] = await Promise.all([
      getDrivingDailySummary(date, userVehicleId),
      getDrivingBehaviorSummary(date, userVehicleId),
    ]);

    return { dailySummary, behaviorSummary };
  }

  function applyHistorySelection(data: {
    dailySummary: DrivingDailySummary | null;
    behaviorSummary: DrivingBehaviorSummary | null;
  }) {
    setSelectedDailySummary(data.dailySummary);
    setSelectedBehaviorSummary(data.behaviorSummary);
  }

  async function loadScoreSectionData(monthKey: string) {
    const { year, month } = parseYearMonthKey(monthKey);
    const scoreTrend = await getDrivingScoreTrend(year, month, userVehicleId);
    const behaviorEntries = await Promise.all(
      scoreTrend.map(async (item) => {
        const behavior = await getDrivingBehaviorSummary(item.snapshotDate, userVehicleId);
        return [item.snapshotDate, behavior] as const;
      }),
    );

    return {
      scoreTrendResponses: scoreTrend,
      scoreSectionBehaviorsByDate: Object.fromEntries(behaviorEntries),
    };
  }

  function applyScoreSectionData(data: {
    scoreTrendResponses: DrivingScoreTrendResponse[];
    scoreSectionBehaviorsByDate: Record<string, DrivingBehaviorSummary | null>;
  }) {
    setScoreSectionTrendResponses(data.scoreTrendResponses);
    setScoreSectionBehaviorsByDate(data.scoreSectionBehaviorsByDate);
  }

  async function fetchDrivingData(
    historyDate = selectedDate,
    historyMonthKey = selectedMonthKey,
    scoreMonthKey = scoreSectionMonthKey,
  ) {
    try {
      setIsError(false);
      const historyMonth = parseYearMonthKey(historyMonthKey);
      const [baseData, historySelectionData, historyMonthData, scoreSectionData] =
        await Promise.all([
          loadBaseDrivingData(),
          loadHistorySelection(historyDate),
          loadHistoryMonthData(historyMonth.year, historyMonth.month),
          loadScoreSectionData(scoreMonthKey),
        ]);

      applyBaseDrivingData(baseData);
      applyHistorySelection(historySelectionData);
      applyHistoryMonthData(historyMonthData);
      applyScoreSectionData(scoreSectionData);
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
        await fetchDrivingData(todayKey, todayMonthKey, todayMonthKey);
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
  }, [userVehicleId]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchHistoryDailySelection() {
      try {
        const historySelectionData = await loadHistorySelection(selectedDate);

        if (!active) {
          return;
        }

        applyHistorySelection(historySelectionData);
      } catch (error) {
        console.error("선택 기준 주행 요약 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchHistoryDailySelection();

    return () => {
      active = false;
    };
  }, [selectedDate]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
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
  }, [selectedDate]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchSelectedHistoryMonthData() {
      try {
        const { year, month } = parseYearMonthKey(selectedMonthKey);
        const historyMonthData = await loadHistoryMonthData(year, month);

        if (!active) {
          return;
        }

        applyHistoryMonthData(historyMonthData);
      } catch (error) {
        console.error("선택 월 주행 요약 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchSelectedHistoryMonthData();

    return () => {
      active = false;
    };
  }, [selectedMonthKey]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      return;
    }

    let active = true;

    async function fetchSelectedScoreSection() {
      try {
        const scoreSectionData = await loadScoreSectionData(scoreSectionMonthKey);

        if (!active) {
          return;
        }

        applyScoreSectionData(scoreSectionData);
      } catch (error) {
        console.error("안전 점수 조회 실패:", error);
        if (active) {
          setIsError(true);
        }
      }
    }

    void fetchSelectedScoreSection();

    return () => {
      active = false;
    };
  }, [scoreSectionMonthKey]);

  useEffect(() => {
    const weeklyItems = buildWeeklySummaries(weeklySummaryResponses);
    if (weeklyItems.length === 0) {
      return;
    }

    const hasSelectedWeek = weeklyItems.some(
      (item) => item.weekKey === selectedWeekKey,
    );
    if (!hasSelectedWeek) {
      setSelectedWeekKey(weeklyItems[weeklyItems.length - 1].weekKey);
    }
  }, [weeklySummaryResponses, selectedWeekKey]);

  async function refresh() {
    try {
      setIsRefreshing(true);
      await fetchDrivingData(selectedDate, selectedMonthKey, scoreSectionMonthKey);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function addDummyDrivingData() {
    try {
      setIsGeneratingDummyData(true);
      setIsError(false);
      await generateAndRefreshDummyDrivingDataForVehicle(userVehicleId);
      await fetchDrivingData(selectedDate, selectedMonthKey, scoreSectionMonthKey);
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
  const scoreSectionMonthOptions = buildRollingMonthOptions(
    todayKey,
    SCORE_SECTION_MONTH_SPAN,
  );
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
  const scoreTrend = formatScoreTrendItems(scoreSectionTrendResponses);
  const scoreChangeListItems = buildScoreChangeListItems(
    scoreTrend,
    scoreSectionBehaviorsByDate,
    todayKey,
  );
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
    scoreSectionMonthKey,
    setScoreSectionMonthKey,
    scoreSectionMonthOptions,
    scoreChangeListItems,
    latestScore,
    latestCarbon,
    recentSessions,
    selectedDailyData,
    weeklySummaries,
    selectedWeeklySummary,
    monthlyHistory,
    monthlySummaryData,
    monthlySummary,
    scoreTrend,
    isLoading,
    isRefreshing,
    isGeneratingDummyData,
    isError,
    refresh,
    addDummyDrivingData,
  };
}
