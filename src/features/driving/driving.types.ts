export type DrivingTab = "history" | "score";
export type DrivingDay = "일" | "월" | "화" | "수" | "목" | "금" | "토";

export interface DailyDrivingData {
  idling: string;
  avgSpeed: string;
  maxSpeed: string;
  accel: number;
  decel: number;
  start: number;
  night: string;
  idlingTime: string;
}

export interface MonthlyHistoryItem {
  month: string;
  distance: number;
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
