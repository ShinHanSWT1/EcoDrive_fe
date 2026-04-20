import { api } from "./client";
import type { ApiResponse, UserMe } from "../types/api";

export async function fetchMe(): Promise<UserMe> {
 const response = await api.get<ApiResponse<UserMe>>("/users/me");
 return response.data.data;
}

export async function uploadMyProfileImage(file: File): Promise<string> {
 const formData = new FormData();
 formData.append("file", file);

 const response = await api.post<ApiResponse<{ profileImageUrl: string }>>(
 "/users/me/profile-image",
 formData,
 );

 return response.data.data.profileImageUrl;
}

export function getKakaoLoginUrl(): string {
 return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
}
