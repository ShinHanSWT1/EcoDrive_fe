import { useEffect, useState } from "react";
import { getDashboardData } from "./dashboard.api";
import type { DashboardData } from "./dashboard.types";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await getDashboardData();

        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("대시보드 데이터 조회 실패:", error);
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
