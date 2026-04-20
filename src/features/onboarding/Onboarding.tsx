import type { UserMe } from "../../shared/types/api";
import VehicleInsuranceFlow from "./VehicleInsuranceFlow";

export default function Onboarding({
 onUserUpdate,
}: {
 onUserUpdate: (user: UserMe) => void;
}) {
 return <VehicleInsuranceFlow onUserUpdate={onUserUpdate} mode="onboarding" />;
}
