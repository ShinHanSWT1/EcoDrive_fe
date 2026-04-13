import { useState, useEffect } from "react";
import { getPaymentData, chargeBalance } from "./payment.api";
import type { PaymentData } from "./payment.types";

export function usePayment() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 초기 데이터 로드 (계좌 잔액, 미션 등)
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await getPaymentData();

        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("payment 데이터 조회 실패:", error);
        if (mounted) {
          setIsError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // 금액 충전 로직 추가
  const handleCharge = async (amount: number) => {
    try {
      // 실제 환경에서는 세션/전역 상태에서 로그인한 유저 ID를 가져와야 합니다.
      // (현재는 임시로 1번 유저 사용)
      const payUserId = 1;

      // DB에 실제 충전 요청
      const updatedAccount = await chargeBalance(payUserId, amount);

      // 충전 성공 시, BE에서 반환받은 최신 잔액으로 즉시 화면 상태 덮어쓰기
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          balance: updatedAccount.balance,
        };
      });

      return true; // 성공 여부 반환 (모달을 닫기 위해)
    } catch (error) {
      console.error("충전 요청 중 오류 발생:", error);
      alert("충전에 실패했습니다. 다시 시도해 주세요.");
      return false; // 실패 반환
    }
  };

  // 3. 컴포넌트에서 사용할 수 있도록 반환값에 handleCharge 추가
  return {
    data,
    isLoading,
    isError,
    handleCharge,
  };
}