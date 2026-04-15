import Insurance from "../features/insurance/Insurance";
import { useMyVehicleSelection } from "../shared/hooks/useMyVehicleSelection";
import VehicleSelectionGuard from "../shared/ui/VehicleSelectionGuard";

export default function InsurancePage() {
  const {
    vehicles,
    selectedUserVehicleId,
    setSelectedUserVehicleId,
    isLoading,
    isError,
  } = useMyVehicleSelection("보험");

  return (
    <VehicleSelectionGuard
      isLoading={isLoading}
      isError={isError}
      selectedUserVehicleId={selectedUserVehicleId}
      loadingMessage="차량 정보를 불러오는 중입니다."
      errorMessage="차량 정보를 불러오지 못했습니다."
    >
      <Insurance
        vehicles={vehicles}
        selectedUserVehicleId={selectedUserVehicleId}
        onVehicleChange={setSelectedUserVehicleId}
      />
    </VehicleSelectionGuard>
  );
}
