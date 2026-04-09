import axios from "axios";
import type { PaymentData } from "./payment.types";

const PAY_SERVER_URL = "http://localhost:8083/pay";

export async function getPaymentData(): Promise<PaymentData> {
  // 1번 사용자(test_user)의 정보를 가져옵니다.
  const response = await axios.get(`${PAY_SERVER_URL}/account/1`);
  const account = response.data;

  // FE의 PaymentData 형식에 맞춰서 반환
  return {
    user: {
      name: account.ownerName,
      balance: account.balance, // 실제 잔액: 966000
      points: 1250, // 포인트는 우선 고정값 (필요 시 다른 API 연결)
      monthlyUsage: 45000,
      score: 0,
      carbonReduction: 0,
    },
    recentHistory: [], // 필요 시 /transactions API 연결 가능
    coupons: [],
    categories: [],
    products: [],
    pointHistory: [],
    historySummary: {
      count: 0,
      average: 0
    } as any,
    missionSummary: {
      completedCount: 0,
      totalReward: 0,
      activeMissions: 0
    } as any,
    missions: [],
  };
}

// 시연용 충전 함수 추가
export async function chargeMoney(amount: number) {
  const response = await axios.post(`${PAY_SERVER_URL}/charge`, {
    payUserId: 1,
    amount: amount
  });
  return response.data;
}