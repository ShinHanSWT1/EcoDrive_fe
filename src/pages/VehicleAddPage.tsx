import type { UserMe } from "../shared/types/api";
import VehicleInsuranceFlow from "../features/onboarding/VehicleInsuranceFlow";

export default function VehicleAddPage({
  onUserUpdate,
}: {
  onUserUpdate: (user: UserMe) => void;
}) {
  return <VehicleInsuranceFlow onUserUpdate={onUserUpdate} mode="vehicle-add" />;
}
