import { useEffect, useState } from "react";
import { getMyVehicles, type MyVehicleResponse } from "../api/onboarding";
import { resolveRepresentativeVehicleId } from "../lib/vehicle";

export function useMyVehicleSelection(errorLabel: string) {
  const [vehicles, setVehicles] = useState<MyVehicleResponse[]>([]);
  const [selectedUserVehicleId, setSelectedUserVehicleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        setIsLoading(true);
        setIsError(false);
        const vehicleList = await getMyVehicles();

        if (!active) {
          return;
        }

        setVehicles(vehicleList);
        setSelectedUserVehicleId(resolveRepresentativeVehicleId(vehicleList));
      } catch (error) {
        console.error(`${errorLabel} 차량 목록 조회 실패:`, error);
        if (active) {
          setIsError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadVehicles();

    return () => {
      active = false;
    };
  }, [errorLabel]);

  return {
    vehicles,
    selectedUserVehicleId,
    setSelectedUserVehicleId,
    isLoading,
    isError,
  };
}
