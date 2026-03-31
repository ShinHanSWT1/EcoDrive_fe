import { useEffect, useState } from "react";
import { getPaymentData } from "./payment.api";
import type { PaymentData } from "./payment.types";

export function usePayment() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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

  return {
    data,
    isLoading,
    isError,
  };
}
