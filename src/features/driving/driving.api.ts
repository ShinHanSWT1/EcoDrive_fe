import { api } from "../../shared/api/client";
import type { ApiResponse } from "../../shared/types/api";

export interface DrivingLatestScore {
  snapshotDate: string | null;
  score: number | null;
}

export interface DrivingRecentSession {
  id: number;
  externalKey: string;
  sessionDate: string;
  startedAt: string;
  endedAt: string;
  distanceKm: number;
  drivingTimeMinutes: number;
  idlingTimeMinutes: number;
  averageSpeed: number;
  maxSpeed: number;
}

export interface DrivingLatestCarbon {
  snapshotDate: string | null;
  carbonReductionKg: number | null;
  rewardPoint: number | null;
}

export interface DrivingDailySummary {
  sessionDate: string;
  sessionCount: number;
  totalDistanceKm: number | null;
  totalDrivingTimeMinutes: number | null;
  totalIdlingTimeMinutes: number | null;
  averageSpeed: number | null;
  maxSpeed: number | null;
  rapidAccelCount: number | null;
  hardBrakeCount: number | null;
  overspeedCount: number | null;
  firstStartedAt: string | null;
  lastEndedAt: string | null;
}

export interface DrivingBehaviorSummary {
  sessionDate: string;
  rapidAccelCount: number;
  hardBrakeCount: number;
  overspeedCount: number;
  nightDrivingCount: number;
  totalIdlingTimeMinutes: number;
}

export interface DrivingWeeklySummary {
  year: number;
  month: number;
  weekOfMonth: number;
  label: string;
  startDate: string | null;
  endDate: string | null;
  dayCount: number;
  sessionCount: number;
  averageDistanceKm: number | null;
  averageIdlingTimeMinutes: number | null;
  averageSpeed: number | null;
  maxSpeed: number | null;
}

export interface DrivingMonthlySummary {
  year: number;
  month: number;
  sessionCount: number;
  dayCount: number;
  totalDistanceKm: number;
  totalDrivingTimeMinutes: number;
  totalIdlingTimeMinutes: number;
  averageSpeed: number | null;
  maxSpeed: number | null;
  rapidAccelCount: number;
  hardBrakeCount: number;
  overspeedCount: number;
  steadyDrivingRatio: number;
  carbonReductionKg: number;
  rewardPoint: number;
}

export interface DrivingScoreTrendResponse {
  snapshotDate: string;
  score: number;
}

export interface DrivingScoreHistoryResponse {
  id: number;
  changeType: string;
  message: string | null;
  scoreDelta: number | null;
  changeDate: string;
}

export interface DummyDrivingAutomationResult {
  generation: {
    generatedBatches: number;
    attemptedUsers: number;
    generatedFiles: string[];
  };
  refresh: {
    processedBatches: number;
    insertedSessions: number;
    insertedEvents: number;
    updatedUsers: number;
    failedFiles: number;
    batchIds: string[];
  };
}

export async function getLatestDrivingScore(): Promise<DrivingLatestScore> {
  const response = await api.get<ApiResponse<DrivingLatestScore>>(
    "/driving/scores/latest",
  );
  return response.data.data;
}

export async function getRecentDrivingSessions(
  limit = 5,
): Promise<DrivingRecentSession[]> {
  const response = await api.get<ApiResponse<DrivingRecentSession[]>>(
    `/driving/sessions/recent?limit=${limit}`,
  );
  return response.data.data;
}

export async function getLatestDrivingCarbon(): Promise<DrivingLatestCarbon> {
  const response = await api.get<ApiResponse<DrivingLatestCarbon>>(
    "/driving/carbon/latest",
  );
  return response.data.data;
}

export async function getDrivingDailySummary(
  date: string,
): Promise<DrivingDailySummary> {
  const response = await api.get<ApiResponse<DrivingDailySummary>>(
    `/driving/daily-summary?date=${date}`,
  );
  return response.data.data;
}

export async function getDrivingWeeklySummaries(
  year: number,
  month: number,
): Promise<DrivingWeeklySummary[]> {
  const response = await api.get<ApiResponse<DrivingWeeklySummary[]>>(
    `/driving/weekly-summaries?year=${year}&month=${month}`,
  );
  return response.data.data;
}

export async function getDrivingBehaviorSummary(
  date: string,
): Promise<DrivingBehaviorSummary> {
  const response = await api.get<ApiResponse<DrivingBehaviorSummary>>(
    `/driving/behavior-summary?date=${date}`,
  );
  return response.data.data;
}

export async function getDrivingMonthlySummary(
  year: number,
  month: number,
): Promise<DrivingMonthlySummary> {
  const response = await api.get<ApiResponse<DrivingMonthlySummary>>(
    `/driving/monthly-summary?year=${year}&month=${month}`,
  );
  return response.data.data;
}

export async function getDrivingScoreTrend(
  year: number,
  month: number,
): Promise<DrivingScoreTrendResponse[]> {
  const response = await api.get<ApiResponse<DrivingScoreTrendResponse[]>>(
    `/driving/scores/trend?year=${year}&month=${month}`,
  );
  return response.data.data;
}

export async function getDrivingScoreHistory(
  limit = 10,
): Promise<DrivingScoreHistoryResponse[]> {
  const response = await api.get<ApiResponse<DrivingScoreHistoryResponse[]>>(
    `/driving/scores/history?limit=${limit}`,
  );
  return response.data.data;
}

export async function generateAndRefreshDummyDrivingData(): Promise<DummyDrivingAutomationResult> {
  const response = await api.post<ApiResponse<DummyDrivingAutomationResult>>(
    "/driving/admin/generate-and-refresh-dummy-data",
  );
  return response.data.data;
}
