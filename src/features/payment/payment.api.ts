import type { PaymentData } from "./payment.types";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import { api } from "../../shared/api/client";
import { getAccessToken } from "../../shared/lib/auth";

const PAY_SERVER_URL = import.meta.env.VITE_PAY_API_BASE_URL;

interface TransactionResponse {
  id: number;
  transactionType: "CHARGE" | "PAYMENT" | "REFUND"; // BE 필드명 통일
  description?: string;
  createdAt: string;
  amount: number;
}

// 실제 거래 내역(Transaction) 조회 API 추가
export async function getTransactions(payUserId: number): Promise<TransactionResponse[]> {
  const response = await api.get(`/pay/account/${payUserId}/transactions`, {
    baseURL: PAY_SERVER_URL,
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  return response.data;
}

export async function getPaymentData(payUserId: number): Promise<PaymentData> {
  const [missionPageData, accountResponse, transactionResponse] = await Promise.all([
    getMissionPageData(),
    api.get(`/pay/account/${payUserId}`, {
      baseURL: PAY_SERVER_URL,
      headers: { "Authorization": `Bearer ${getAccessToken()}` }
    }),
    api.get(`/pay/account/${payUserId}/transactions`, {
      baseURL: PAY_SERVER_URL,
      headers: { "Authorization": `Bearer ${getAccessToken()}` }
    })
  ]);

  const accountData = accountResponse.data;
  const transactions = transactionResponse.data;

  const mappedHistory = transactions.map((tx: TransactionResponse) => {
    const isCharge = tx.transactionType === "CHARGE";

    return {
      id: tx.id,
      // title, type, category 모두 동일하게 isCharge(transactionType)를 기준으로 판단
      title: isCharge ? "잔액 충전" : (tx.description || "결제 내역"),
      date: new Date(tx.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
      amount: tx.amount,
      type: isCharge ? "earn" : "pay", // UI 표시용 타입 (적립/지출)
      category: isCharge ? "충전" : "결제"
    };
  });

  return {
    ...paymentMockData,
    user: {
      ...paymentMockData.user,
      balance: accountData.balance,
      points: accountData.points || 0,
      monthlyUsage: accountData.monthUsage || 0,
    },
    recentHistory: mappedHistory.slice(0, 4),
    allHistory: mappedHistory,
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}

// 3. 실제 충전 API
export async function chargeBalance(payUserId: number, amount: number) {
  const response = await api.post(
      "/pay/charge",
      { payUserId, amount },
      {
        baseURL: PAY_SERVER_URL,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
        }
      }
  );
  return response.data;
}