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
  month: string;
  distance: number;
}

export interface WeeklySummaryItem {
  weekKey: string;
  label: string;
  averageDistance: string;
  averageIdling: string;
  averageSpeed: string;
  maxSpeed: string;
}

export interface ScoreTrendItem {
  date: string;
  score: number;
}

export interface ScoreHistoryItem {
  id: number;
  type: "up" | "down";
  change: number;
  reason: string;
  date: string;
}
