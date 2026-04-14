import type { PaymentData } from "./payment.types";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import { api } from "../../shared/api/client";

// 보안 헤더 상수 (추후 환경변수 처리 권장)
const INTERNAL_TOKEN = "local-dev-token";
const PAY_SERVER_URL = import.meta.env.VITE_PAY_API_BASE_URL;

// 실제 거래 내역(Transaction) 조회 API 추가
export async function getTransactions(payUserId: number): Promise<any[]> {
  try {
    const response = await api.get(`/pay/account/${payUserId}/transactions`, {
      baseURL: PAY_SERVER_URL,
      headers: { "X-Internal-Token": INTERNAL_TOKEN }
    });
    return response.data;
  } catch (error) {
    console.error("거래 내역 조회 실패:", error);
    return [];
  }
}

export async function getPaymentData(): Promise<PaymentData> {
  const payUserId = 1;

  // 병렬 호출 리스트에 transactions 추가
  const [missionPageData, accountResponse, transactionResponse] = await Promise.all([
    getMissionPageData(),
    api.get(`/pay/account/${payUserId}`, {
      baseURL: PAY_SERVER_URL,
      headers: { "X-Internal-Token": INTERNAL_TOKEN }
    }),
    api.get(`/pay/account/${payUserId}/transactions`, { // 추가된 부분
      baseURL: PAY_SERVER_URL,
      headers: { "X-Internal-Token": INTERNAL_TOKEN }
    })
  ]);

  const accountData = accountResponse.data;
  const transactions = transactionResponse.data;
  console.log("백엔드 거래 내역 데이터:", transactions);

  // 백엔드 Transaction 데이터를 FE의 PaymentHistoryItem 형식으로 변환
  const mappedHistory = transactions.map((tx: any) => ({
    id: tx.id,
    title: tx.type === "CHARGE" ? "잔액 충전" : (tx.description || "결제 내역"),
    date: new Date(tx.createdAt).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    }),
    amount: tx.amount,
    type: tx.transactionType === "CHARGE" ? "earn" : "pay",

    category: tx.transactionType === "CHARGE" ? "충전" : "결제"
  }));

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

// 실제 충전 API
export async function chargeBalance(payUserId: number, amount: number) {
  const response = await api.post(
      "/pay/charge",
      { payUserId, amount },
      {
        baseURL: PAY_SERVER_URL,
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Token": INTERNAL_TOKEN,
        }
      }
  );

  return response.data;
}