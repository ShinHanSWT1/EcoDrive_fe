import DrivingReport from "../features/driving/DrivingReport";
import { useMyVehicleSelection } from "../shared/hooks/useMyVehicleSelection";
import VehicleSelectionGuard from "../shared/ui/VehicleSelectionGuard";

export default function ReportPage() {
  const {
    vehicles,
    selectedUserVehicleId,
    setSelectedUserVehicleId,
    isLoading,
    isError,
  } = useMyVehicleSelection("리포트");

  return (
    <VehicleSelectionGuard
      isLoading={isLoading}
      isError={isError}
      selectedUserVehicleId={selectedUserVehicleId}
      loadingMessage="차량 정보를 불러오는 중입니다."
      errorMessage="차량 정보를 불러오지 못했습니다."
      allowEmptySelection
    >
      <DrivingReport
        vehicles={vehicles}
        selectedUserVehicleId={selectedUserVehicleId}
        onVehicleChange={setSelectedUserVehicleId}
      />
    </VehicleSelectionGuard>
  );
}
