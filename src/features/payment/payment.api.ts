import axios from "axios";
import type { ApiResponse } from "../../shared/types/api";
import { api } from "../../shared/api/client";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import type { PaymentData, PaymentHistoryItem, PaymentWalletInfo } from "./payment.types";

interface PayWalletResponse {
  payUserId: number;
  payAccountId: number;
  accountNumber: string;
  bankCode: string | null;
  ownerName: string;
  balance: number;
  status: string;
}

interface PayTransactionResponse {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "pay" | "earn";
  category: string;
}

interface PayChargePrepareResponse {
  orderId: string;
  amount: number;
  expiresAt: string;
}

function isWalletNotFoundError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404 && error.response?.data?.code === "PAY_001";
}

function toWalletInfo(wallet: PayWalletResponse): PaymentWalletInfo {
  return {
    payUserId: wallet.payUserId,
    payAccountId: wallet.payAccountId,
    accountNumber: wallet.accountNumber,
    bankCode: wallet.bankCode,
    ownerName: wallet.ownerName,
    status: wallet.status,
  };
}

function toHistoryItems(transactions: PayTransactionResponse[]): PaymentHistoryItem[] {
  return transactions.map((tx) => ({
    id: tx.id,
    title: tx.title,
    date: tx.date,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
  }));
}

async function getMyWallet(): Promise<PayWalletResponse> {
  const response = await api.get<ApiResponse<PayWalletResponse>>("/pay/account");
  return response.data.data;
}

async function getMyTransactions(): Promise<PayTransactionResponse[]> {
  const response = await api.get<ApiResponse<PayTransactionResponse[]>>("/pay/transactions");
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

  let history: PaymentHistoryItem[] = [];
  if (wallet) {
    try {
      const transactions = await getMyTransactions();
      history = toHistoryItems(transactions);
    } catch (error) {
      console.error("payment 거래내역 조회 실패:", error);
    }
  }

  return {
    ...paymentMockData,
    walletMissing: wallet == null,
    wallet: wallet ? toWalletInfo(wallet) : null,
    user: {
      ...paymentMockData.user,
      balance: wallet?.balance ?? 0,
    },
    recentHistory: history.slice(0, 4),
    allHistory: history,
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}

export async function chargeBalance(amount: number): Promise<PayWalletResponse> {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/charge", { amount });
  return response.data.data;
}

export async function prepareCharge(amount: number): Promise<PayChargePrepareResponse> {
  const response = await api.post<ApiResponse<PayChargePrepareResponse>>("/pay/charge/prepare", { amount });
  return response.data.data;
}

export async function confirmCharge(paymentKey: string, orderId: string, amount: number) {
  const response = await api.post<ApiResponse<PayWalletResponse>>("/pay/charge/confirm", {
    paymentKey,
    orderId,
    amount,
  });
  return response.data.data;
}
