import { useEffect, useState, useCallback } from "react";
import { getPaymentData } from "./payment.api";
import type { PaymentData } from "./payment.types";

export function usePayment() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // refresh 함수 (충전 후 호출될 함수)
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const result = await getPaymentData();
      setData(result);
    } catch (error) {
      console.error("payment 데이터 조회 실패:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드 시 실행
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, isError, refresh };
}