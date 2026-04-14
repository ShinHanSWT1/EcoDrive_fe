import { api } from "./client";
import type { ApiResponse } from "../types/api";

export interface AddressResult {
  roadAddr: string; // 전체 도로명주소
  jibunAddr: string; // 지번 주소
  zipNo: string; // 우편번호
  bdNm: string; // 건물명
}

export async function searchAddress(keyword: string): Promise<AddressResult[]> {
  const response = await api.get<ApiResponse<AddressResult[]>>(
    "/address/search",
    {
      params: { keyword },
    },
  );
  return response.data.data;
}
