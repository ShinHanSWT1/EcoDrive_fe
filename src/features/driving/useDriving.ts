import { useEffect, useState } from "react";
import type { DailyDrivingData, DrivingTab, MonthlyHistoryItem, WeeklySummaryItem } from "./driving.types";
import {
  getLatestDrivingCarbon,
  getLatestDrivingScore,
  getRecentDrivingSessions,
  type DrivingLatestCarbon,
  type DrivingLatestScore,
  type DrivingRecentSession,
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

function getMonthWeekLabel(dateValue: string): string {
  const date = new Date(dateValue);
  return `${date.getMonth() + 1}월 ${Math.ceil(date.getDate() / 7)}주차`;
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

function buildDailyDataByDate(
  sessions: DrivingRecentSession[],
): Record<string, DailyDrivingData> {
  const grouped = new Map<string, DrivingRecentSession[]>();

  sessions.forEach((session) => {
    const current = grouped.get(session.sessionDate) ?? [];
    current.push(session);
    grouped.set(session.sessionDate, current);
  });

  return Array.from(grouped.entries()).reduce(
    (acc, [dateKey, daySessions]) => {
      const totalDistance = daySessions.reduce(
        (sum, session) => sum + session.distanceKm,
        0,
      );
      const totalIdling = daySessions.reduce(
        (sum, session) => sum + session.idlingTimeMinutes,
        0,
      );
      const averageSpeed =
        daySessions.reduce((sum, session) => sum + session.averageSpeed, 0) /
        daySessions.length;
      const maxSpeed = Math.max(...daySessions.map((session) => session.maxSpeed));

      acc[dateKey] = {
        totalDistance: `${totalDistance.toFixed(2)}km`,
        idling: `${totalIdling}분`,
        avgSpeed: `${averageSpeed.toFixed(2)}km/h`,
        maxSpeed: `${maxSpeed.toFixed(2)}km/h`,
        accel: null,
        decel: null,
        start: null,
        night: null,
        idlingTime: `${totalIdling}분`,
      };

      return acc;
    },
    {} as Record<string, DailyDrivingData>,
  );
}

function buildMonthlyHistory(sessions: DrivingRecentSession[]): MonthlyHistoryItem[] {
  const grouped = new Map<string, number>();

  sessions.forEach((session) => {
    const monthLabel = `${new Date(session.sessionDate).getMonth() + 1}월`;
    grouped.set(monthLabel, (grouped.get(monthLabel) ?? 0) + session.distanceKm);
  });

  return Array.from(grouped.entries())
    .map(([month, distance]) => ({
      month,
      distance: Number(distance.toFixed(2)),
    }))
    .sort((a, b) => a.month.localeCompare(b.month, "ko"));
}

function buildWeeklySummaries(
  sessions: DrivingRecentSession[],
): WeeklySummaryItem[] {
  const grouped = new Map<string, DrivingRecentSession[]>();

  [...sessions]
    .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
    .forEach((session) => {
      const weekKey = getMonthWeekKey(session.sessionDate);
      const current = grouped.get(weekKey) ?? [];
      current.push(session);
      grouped.set(weekKey, current);
    });

  return Array.from(grouped.entries())
    .map(([weekKey, weekSessions]) => {
      const averageDistance =
        weekSessions.reduce((sum, session) => sum + session.distanceKm, 0) /
        weekSessions.length;
      const averageIdling =
        weekSessions.reduce((sum, session) => sum + session.idlingTimeMinutes, 0) /
        weekSessions.length;
      const averageSpeed =
        weekSessions.reduce((sum, session) => sum + session.averageSpeed, 0) /
        weekSessions.length;
      const maxSpeed = Math.max(...weekSessions.map((session) => session.maxSpeed));

      return {
        weekKey,
        label: getMonthWeekLabel(weekSessions[0].sessionDate),
        averageDistance: `${averageDistance.toFixed(2)}km`,
        averageIdling: `${averageIdling.toFixed(0)}분`,
        averageSpeed: `${averageSpeed.toFixed(2)}km/h`,
        maxSpeed: `${maxSpeed.toFixed(2)}km/h`,
      };
    })
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchDrivingData() {
    try {
      setIsError(false);
      const [score, carbon, sessions] = await Promise.all([
        getLatestDrivingScore(),
        getLatestDrivingCarbon(),
        getRecentDrivingSessions(20),
      ]);

      setLatestScore(score);
      setLatestCarbon(carbon);
      setRecentSessions(sessions);
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
        await fetchDrivingData();
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

  async function refresh() {
    try {
      setIsRefreshing(true);
      await fetchDrivingData();
    } finally {
      setIsRefreshing(false);
    }
  }

  const dailyDataByDate = buildDailyDataByDate(recentSessions);
  const availableDateKeys = Object.keys(dailyDataByDate).sort((a, b) => a.localeCompare(b));
  const weeklySummaries = buildWeeklySummaries(recentSessions);
  const selectedWeeklySummary =
    weeklySummaries.find((item) => item.weekKey === selectedWeekKey) ?? null;
  const selectedDailyData = dailyDataByDate[selectedDate] ?? getEmptyDailyData();

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
    monthlyHistory: buildMonthlyHistory(recentSessions),
    isLoading,
    isRefreshing,
    isError,
    refresh,
  };
}
