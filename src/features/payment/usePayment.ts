import { useState, useEffect, useCallback, useRef } from "react";
import { getPaymentData, chargeBalance } from "./payment.api";
import type { PaymentData } from "./payment.types";

export function usePayment(payUserId?: number) {
  const [data, setData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const requestSeq = useRef(0);

  // 초기 데이터 로드 (계좌 잔액, 미션 등)
  const fetchData = useCallback(async () => {
    if (!Number.isInteger(payUserId) || (payUserId as number) <= 0) {
      setData(null);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    const seq = ++requestSeq.current;
    setIsLoading(true);

    try {
      setIsError(false);

      const result = await getPaymentData(payUserId);
      if (requestSeq.current !== seq) return;
      setData(result);
    } catch (error) {
      if (requestSeq.current !== seq) return;
      console.error("payment 데이터 조회 실패:", error);
      setIsError(true);
    } finally {
      if (requestSeq.current !== seq) return;
      setIsLoading(false);
    }
  }, [payUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 금액 충전 로직 추가
  const handleCharge = async (amount: number) => {
    if (!payUserId) return false;
    try {
      const updatedAccount = await chargeBalance(payUserId, amount);

      // 충전 성공 시, BE에서 반환받은 최신 잔액으로 즉시 화면 상태 덮어쓰기
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            balance: updatedAccount.balance,
          }
        };
      });

      return true;
    } catch (error) {
      console.error("충전 요청 중 오류 발생:", error);
      alert("충전에 실패했습니다. 다시 시도해 주세요.");
      return false; // 실패 반환
    }
  };

  return {
    data,
    isLoading,
    isError,
    handleCharge,
  };
}