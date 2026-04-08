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
