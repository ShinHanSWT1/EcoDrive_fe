import { paymentMockData } from "./payment.mock";
import type { PaymentData } from "./payment.types";
import { getMissionPageData } from "../mission/mission.api";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPaymentData(): Promise<PaymentData> {
  await delay(300);
  // 미션 데이터 실시간 조회 적용함
  const missionPageData = await getMissionPageData();

  return {
    ...paymentMockData,
    missionSummary: missionPageData.summary,
    missions: missionPageData.missions,
  };
}
