import type { PaymentData } from "./payment.types";
import { getMissionPageData } from "../mission/mission.api";
import { paymentMockData } from "./payment.mock";
import { api } from "../../shared/api/client";

// 보안 헤더 상수 (추후 환경변수 처리 권장)
const INTERNAL_TOKEN = "local-dev-token";
const PAY_SERVER_URL = import.meta.env.VITE_PAY_API_BASE_URL;

export async function getPaymentData(): Promise<PaymentData> {
  // 1. 유저 ID (실제로는 로그인 세션 등에서 가져와야 함. 일단 1로 고정)
  const payUserId = 1;

  // 2. 미션 데이터와 페이 계좌 정보를 병렬로 호출
  const [missionPageData, accountResponse] = await Promise.all([
    getMissionPageData(),
    api.get(`/pay/account/${payUserId}`, {
      baseURL: PAY_SERVER_URL,
      headers: { "X-Internal-Token": INTERNAL_TOKEN }
    })
  ]);

  // Axios를 사용할 경우 응답 데이터는 .data 안에 담깁니다.
  const accountData = accountResponse.data;

  // 3. Mock 데이터의 껍데기(상품, 내역 등)에 실제 DB 잔액을 덮어씌워서 반환
  return {
    ...paymentMockData, // 상품, 카테고리, 결제 내역 등 아직 API가 없는 데이터 유지
    user: {
      ...paymentMockData.user,
      balance: accountData.balance, // 실제 DB 잔액으로 덮어쓰기
      points: accountData.points || 0,
      monthlyUsage: 458000,
    },
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}

// 실제 충전 API 연결
export async function chargeBalance(payUserId: number, amount: number) {
  const response = await api.post(
      "/pay/charge",
      { payUserId, amount }, // body 내용
      {
        baseURL: PAY_SERVER_URL,
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Token": INTERNAL_TOKEN,
        }
      }
  );

  // 충전 성공 시 업데이트된 PayAccount 객체 반환
  return response.data;
}