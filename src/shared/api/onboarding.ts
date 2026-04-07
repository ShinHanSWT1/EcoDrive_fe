import { api } from "./client";
import { getAccessToken } from "../lib/auth";
import type { ApiResponse } from "../types/api";

export interface RegisterVehicleRequest {
  vehicleNumber: string;
  vehicleModelId: number;
}

export interface RegisterVehicleResponse {
  userVehicleId: number;
  vehicleNumber: string;
  vehicleModelId: number;
  isOnboardingCompleted: boolean;
}

export interface RegisterInsuranceRequest {
  userVehicleId: number;
  insuranceCompanyName: string;
  insuranceProductName?: string;
  annualPremium: number;
  insuranceStartedAt: string;
}

export interface RegisterInsuranceResponse {
  userInsuranceId: number;
  userVehicleId: number;
  insuranceCompanyId: number;
  insuranceContractId: number;
  isOnboardingCompleted: boolean;
}

export interface CompleteOnboardingResponse {
  isOnboardingCompleted: boolean;
}

export interface VehicleModelSummary {
  id: number;
  manufacturer: string;
  modelName: string;
  modelYear: number;
  fuelType: string;
}

function buildAuthConfig() {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function searchVehicleModels(keyword: string) {
  const response = await api.get<ApiResponse<VehicleModelSummary[]>>(
    "/vehicles/models",
    {
      params: { keyword },
    },
  );
  return response.data.data;
}

export async function registerMyVehicle(request: RegisterVehicleRequest) {
  const response = await api.post<ApiResponse<RegisterVehicleResponse>>(
    "/users/me/vehicles",
    request,
    buildAuthConfig(),
  );
  return response.data.data;
}

export async function registerMyInsurance(request: RegisterInsuranceRequest) {
  const response = await api.post<ApiResponse<RegisterInsuranceResponse>>(
    "/users/me/insurances",
    request,
    buildAuthConfig(),
  );
  return response.data.data;
}

export async function completeMyOnboarding() {
  const response = await api.patch<ApiResponse<CompleteOnboardingResponse>>(
    "/users/me/onboarding",
    undefined,
    buildAuthConfig(),
  );
  return response.data.data;
}
