import { api } from "./client";
import type { ApiResponse, UserMe } from "../types/api";

export async function fetchMe(): Promise<UserMe> {
  const response = await api.get<ApiResponse<UserMe>>("/users/me");
  return response.data.data;
}

export function getKakaoLoginUrl(): string {
  return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
}
