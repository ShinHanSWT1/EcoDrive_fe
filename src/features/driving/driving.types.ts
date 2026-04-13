export type DrivingTab = "history" | "score";

export type DrivingDay = "일" | "월" | "화" | "수" | "목" | "금" | "토";

export interface DailyDrivingData {
  totalDistance: string | null;
  idling: string | null;
  avgSpeed: string | null;
  maxSpeed: string | null;
  accel: number | null;
  decel: number | null;
  start: number | null;
  night: string | null;
  idlingTime: string | null;
}

export interface MonthlyHistoryItem {
  yearMonthKey: string;
  month: string;
  distance: number;
  isSelected: boolean;
}

export interface MonthlySummaryData {
  label: string;
  totalDistance: string | null;
  sessionCount: number | null;
  dayCount: number | null;
}

export interface WeeklySummaryItem {
  weekKey: string;
  label: string;
  averageDistance: string;
  averageIdling: string;
  averageSpeed: string;
  maxSpeed: string;
}

export interface MonthOption {
  key: string;
  label: string;
}

export interface ScoreTrendItem {
  fullDate: string;
  date: string;
  score: number;
  deltaFromPrevious: number | null;
}

export interface ScoreChangeListItem {
  fullDate: string;
  dateLabel: string;
  score: number;
  deltaFromPrevious: number | null;
  summary: string;
  isToday: boolean;
}

export interface ScoreHistoryItem {
  id: number;
  type: "up" | "down";
  change: number;
  reason: string;
  date: string;
}
