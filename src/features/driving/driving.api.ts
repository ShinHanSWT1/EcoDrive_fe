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

interface DrivingDailySummaryRaw {
  date: string;
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
  totalDistanceKm: number | null;
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

type DrivingQueryParams = Record<string, number | string>;

function withOptionalVehicleParams(
  baseParams: DrivingQueryParams,
  userVehicleId?: number | null,
) {
  return userVehicleId ? { ...baseParams, userVehicleId } : baseParams;
}

function mapDrivingDailySummary(raw: DrivingDailySummaryRaw): DrivingDailySummary {
  return {
    sessionDate: raw.date,
    sessionCount: raw.sessionCount,
    totalDistanceKm: raw.totalDistanceKm,
    totalDrivingTimeMinutes: raw.totalDrivingTimeMinutes,
    totalIdlingTimeMinutes: raw.totalIdlingTimeMinutes,
    averageSpeed: raw.averageSpeed,
    maxSpeed: raw.maxSpeed,
    rapidAccelCount: raw.rapidAccelCount,
    hardBrakeCount: raw.hardBrakeCount,
    overspeedCount: raw.overspeedCount,
    firstStartedAt: raw.firstStartedAt,
    lastEndedAt: raw.lastEndedAt,
  };
}

export async function getLatestDrivingScore(): Promise<DrivingLatestScore> {
  return getLatestDrivingScoreByVehicle();
}

export async function getLatestDrivingScoreByVehicle(
  userVehicleId?: number | null,
): Promise<DrivingLatestScore> {
  const response = await api.get<ApiResponse<DrivingLatestScore>>(
    "/driving/scores/latest",
    { params: withOptionalVehicleParams({}, userVehicleId) },
  );
  return response.data.data;
}

export async function getRecentDrivingSessions(
  limit = 5,
  userVehicleId?: number | null,
): Promise<DrivingRecentSession[]> {
  const response = await api.get<ApiResponse<DrivingRecentSession[]>>(
    "/driving/sessions/recent",
    { params: withOptionalVehicleParams({ limit }, userVehicleId) },
  );
  return response.data.data;
}

export async function getLatestDrivingCarbon(): Promise<DrivingLatestCarbon> {
  return getLatestDrivingCarbonByVehicle();
}

export async function getLatestDrivingCarbonByVehicle(
  userVehicleId?: number | null,
): Promise<DrivingLatestCarbon> {
  const response = await api.get<ApiResponse<DrivingLatestCarbon>>(
    "/driving/carbon/latest",
    { params: withOptionalVehicleParams({}, userVehicleId) },
  );
  return response.data.data;
}

export async function getDrivingOverviewByVehicle(
  userVehicleId?: number | null,
) {
  const [score, carbon] = await Promise.all([
    getLatestDrivingScoreByVehicle(userVehicleId),
    getLatestDrivingCarbonByVehicle(userVehicleId),
  ]);

  return { score, carbon };
}

export async function getDrivingDailySummary(
  date: string,
  userVehicleId?: number | null,
): Promise<DrivingDailySummary> {
  const response = await api.get<ApiResponse<DrivingDailySummaryRaw>>(
    "/driving/daily-summary",
    { params: withOptionalVehicleParams({ date }, userVehicleId) },
  );
  return mapDrivingDailySummary(response.data.data);
}

export async function getDrivingDailySummaries(
  year: number,
  month: number,
  userVehicleId?: number | null,
): Promise<DrivingDailySummary[]> {
  const response = await api.get<ApiResponse<DrivingDailySummaryRaw[]>>(
    "/driving/daily-summaries",
    { params: withOptionalVehicleParams({ year, month }, userVehicleId) },
  );
  return response.data.data.map(mapDrivingDailySummary);
}

export async function getDrivingWeeklySummaries(
  year: number,
  month: number,
  userVehicleId?: number | null,
): Promise<DrivingWeeklySummary[]> {
  const response = await api.get<ApiResponse<DrivingWeeklySummary[]>>(
    "/driving/weekly-summaries",
    { params: withOptionalVehicleParams({ year, month }, userVehicleId) },
  );
  return response.data.data;
}

export async function getDrivingBehaviorSummary(
  date: string,
  userVehicleId?: number | null,
): Promise<DrivingBehaviorSummary> {
  const response = await api.get<ApiResponse<DrivingBehaviorSummary>>(
    "/driving/behavior-summary",
    { params: withOptionalVehicleParams({ date }, userVehicleId) },
  );
  return response.data.data;
}

export async function getDrivingMonthlySummary(
  year: number,
  month: number,
  userVehicleId?: number | null,
): Promise<DrivingMonthlySummary> {
  const response = await api.get<ApiResponse<DrivingMonthlySummary>>(
    "/driving/monthly-summary",
    { params: withOptionalVehicleParams({ year, month }, userVehicleId) },
  );
  return response.data.data;
}

export async function getDrivingScoreTrend(
  year: number,
  month: number,
  userVehicleId?: number | null,
): Promise<DrivingScoreTrendResponse[]> {
  const response = await api.get<ApiResponse<DrivingScoreTrendResponse[]>>(
    "/driving/scores/trend",
    { params: withOptionalVehicleParams({ year, month }, userVehicleId) },
  );
  return response.data.data;
}

export async function getDrivingScoreHistory(
  limit = 10,
  userVehicleId?: number | null,
): Promise<DrivingScoreHistoryResponse[]> {
  const response = await api.get<ApiResponse<DrivingScoreHistoryResponse[]>>(
    "/driving/scores/history",
    { params: withOptionalVehicleParams({ limit }, userVehicleId) },
  );
  return response.data.data;
}

export async function generateAndRefreshDummyDrivingData(): Promise<DummyDrivingAutomationResult> {
  return generateAndRefreshDummyDrivingDataForVehicle();
}

export async function generateAndRefreshDummyDrivingDataForVehicle(
  userVehicleId?: number | null,
): Promise<DummyDrivingAutomationResult> {
  const response = await api.post<ApiResponse<DummyDrivingAutomationResult>>(
    "/driving/admin/generate-and-refresh-dummy-data",
    userVehicleId ? { userVehicleId } : undefined,
  );
  return response.data.data;
}
