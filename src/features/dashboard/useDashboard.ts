import { useEffect, useState } from "react";
import { getDashboardData, getDashboardDriverInsight } from "./dashboard.api";
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

          getDashboardDriverInsight()
            .then((driverInsight) => {
              if (!mounted) {
                return;
              }

              setData((current) => {
                if (!current) {
                  return current;
                }

                return {
                  ...current,
                  driverInsight,
                };
              });
            })
            .catch((error) => {
              console.warn("운전자 인사이트 지연 로드 실패:", error);
            });
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
