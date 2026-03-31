import { useEffect, useState } from "react";
import { getInsurancePageData } from "./insurance.api";
import type { InsurancePageData } from "./insurance.types";

export function useInsurance() {
  const [data, setData] = useState<InsurancePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchInsuranceData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await getInsurancePageData();

        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("보험 데이터 조회 실패:", error);

        if (mounted) {
          setIsError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInsuranceData();

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
