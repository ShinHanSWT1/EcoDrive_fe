import { api } from "./client";
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

export interface MyVehicleResponse {
  userVehicleId: number;
  vehicleNumber: string;
  vehicleModelId: number;
  manufacturer: string;
  modelName: string;
  modelYear: number;
  fuelType: string;
  status: string;
  registeredAt: string;
  isRepresentative: boolean;
}

export interface RegisterInsuranceRequest {
  userVehicleId: number;
  insuranceCompanyName: string;
  insuranceProductName?: string;
  planType: string;
  annualPremium: number;
  insuranceStartedAt: string;
  age: number;
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
  );
  return response.data.data;
}

export async function getMyVehicles() {
  const response = await api.get<ApiResponse<{ vehicles: MyVehicleResponse[] }>>(
    "/users/me/vehicles",
  );
  return response.data.data.vehicles;
}

export async function updateRepresentativeVehicle(userVehicleId: number) {
  const response = await api.patch<ApiResponse<{ userVehicleId: number }>>(
    "/users/me/representative-vehicle",
    { userVehicleId },
  );
  return response.data.data;
}

export async function registerMyInsurance(request: RegisterInsuranceRequest) {
  const response = await api.post<ApiResponse<RegisterInsuranceResponse>>(
    "/users/me/onboarding/insurances",
    request,
  );
  return response.data.data;
}

export async function completeMyOnboarding() {
  const response = await api.patch<ApiResponse<CompleteOnboardingResponse>>(
    "/users/me/onboarding",
    undefined,
  );
  return response.data.data;
}
