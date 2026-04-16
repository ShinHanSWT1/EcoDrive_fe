import type { MyVehicleResponse } from "../api/onboarding";

export function resolveRepresentativeVehicleId(
  vehicles: MyVehicleResponse[],
): number | null {
  return (
    vehicles.find((vehicle) => vehicle.isRepresentative)?.userVehicleId
    ?? vehicles[0]?.userVehicleId
    ?? null
  );
}
