import axios from "axios";
import type { ApiResponse } from "../../shared/types/api";
import { api } from "../../shared/api/client";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import type { PaymentData } from "./payment.types";

interface PayWalletResponse {
  payUserId: number;
  payAccountId: number;
  accountNumber: string;
  bankCode: string | null;
  ownerName: string;
  balance: number;
  status: string;
}

function isWalletNotFoundError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404 && error.response?.data?.code === "PAY_001";
}

async function getMyWallet(): Promise<PayWalletResponse> {
  const response = await api.get<ApiResponse<PayWalletResponse>>("/pay/account");
  return response.data.data;
}

export async function createMyWallet(): Promise<PayWalletResponse> {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/account");
  return response.data.data;
}

async function getWalletOrNull(): Promise<PayWalletResponse | null> {
  try {
    return await getMyWallet();
  } catch (error) {
    if (isWalletNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function getPaymentData(): Promise<PaymentData> {
  const [missionPageData, wallet] = await Promise.all([
    getMissionPageData(),
    getWalletOrNull(),
  ]);

  return {
    ...paymentMockData,
    walletMissing: wallet == null,
    user: {
      ...paymentMockData.user,
      balance: wallet?.balance ?? 0,
    },
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}

export async function chargeBalance(amount: number): Promise<PayWalletResponse> {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/charge", { amount });
  return response.data.data;
}
